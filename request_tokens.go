package main

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
	"net/url"
	"strings"
)

type TokenRequestData struct {
	TokenEndpoint            string `json:"tokenEndpoint"`
	ClientID                 string `json:"clientID"`
	ClientSecret             string `json:"clientSecret"`
	IncludeCredentialsInBody bool   `json:"includeCredentialsInBody"`
	Code                     string `json:"code"`
	RedirectURI              string `json:"redirectURI"`
}

func handleRequestTokens(w http.ResponseWriter, r *http.Request) {
	var receivedData TokenRequestData
	if err := json.NewDecoder(r.Body).Decode(&receivedData); err != nil {
		log.Fatal(err)
	}
	defer r.Body.Close()

	tokenReqBody := url.Values{}
	tokenReqBody.Set("grant_type", "authorization_code")
	tokenReqBody.Set("code", receivedData.Code)
	tokenReqBody.Set("redirect_uri", receivedData.RedirectURI)
	if receivedData.IncludeCredentialsInBody {
		tokenReqBody.Set("client_id", receivedData.ClientID)
		tokenReqBody.Set("client_secret", receivedData.ClientSecret)
	}
	tokenReq, err := http.NewRequest(http.MethodPost, receivedData.TokenEndpoint, strings.NewReader(tokenReqBody.Encode()))
	if err != nil {
		log.Fatal(err)
	}
	tokenReq.SetBasicAuth(receivedData.ClientID, receivedData.ClientSecret)
	tokenReq.Header.Add("Accept", "application/json")
	tokenReq.Header.Add("Content-Type", "application/x-www-form-urlencoded")
	tokenEndpointURL, err := url.Parse(receivedData.TokenEndpoint)
	if err != nil {
		log.Fatal(err)
	}
	tokenReq.Header.Add("Host", tokenEndpointURL.Host) // Some sites require this

	client := &http.Client{}
	tokenResponse, err := client.Do(tokenReq)
	if err != nil {
		log.Fatal(err)
	}

	if tokenResponse.StatusCode != http.StatusOK {
		log.Printf("received response: %s", tokenResponse.Status)
		responseBody, err := io.ReadAll(tokenResponse.Body)
		defer tokenResponse.Body.Close()
		if err != nil {
			log.Fatalf("error reading response body: %v", err)
		}
		log.Fatalf("%s", responseBody)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	io.Copy(w, tokenResponse.Body)
}
