package main

import (
	"log"
	"net/http"
	"os"
	"path/filepath"
)

func main() {
	fs := http.FileServer(http.Dir("static"))
	http.Handle("/static/", http.StripPrefix("/static/", fs))
	http.HandleFunc("/", handleIndex)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Printf("OAuth server running on port %s\n", port)
	http.ListenAndServe(":"+port, nil)
}

func handleIndex(w http.ResponseWriter, r *http.Request) {
	content, err := os.ReadFile(filepath.Join("static", "index.html"))
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Header().Add("Content-Type", "text/html")
	w.Write(content)
}
