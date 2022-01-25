package main

import (
	"log"
	"net/http"
	"os"
	"path/filepath"
	"regexp"
)

func main() {
	fs := http.FileServer(http.Dir("static"))
	http.HandleFunc("/request-tokens", handleRequestTokens)
	http.Handle("/static/", http.StripPrefix("/static/", fs))
	http.HandleFunc("/", handleStaticHTML)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Printf("OAuth server running on port %s\n", port)
	http.ListenAndServe(":"+port, nil)
}

var receiveCodePathRe = regexp.MustCompile(`.*receive-code(\.html)?$`)

func handleStaticHTML(w http.ResponseWriter, r *http.Request) {
	filePath := filepath.Join("static", "index.html")
	if receiveCodePathRe.MatchString(r.URL.Path) {
		filePath = filepath.Join("static", "receive-code.html")
	}
	content, err := os.ReadFile(filePath)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Header().Add("Content-Type", "text/html")
	w.Write(content)
}
