package main

import (
	"html/template"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
)

type PageData struct {
	ClusterName string
}

func main() {
	// Parse the template
	tmpl, err := template.ParseFiles("templates/index.html")
	if err != nil {
		log.Fatal("Error parsing template:", err)
	}

	// Get cluster name from environment variable or use default
	clusterName := os.Getenv("CLUSTER_NAME")
	if clusterName == "" {
		clusterName = "Default Cluster"
	}

	// Handler for the root path
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		// If the path is exactly "/", serve the index page
		if r.URL.Path == "/" {
			data := PageData{
				ClusterName: clusterName,
			}

			err := tmpl.Execute(w, data)
			if err != nil {
				log.Printf("Error executing template: %v", err)
				http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			}
			return
		}

		// For static files, let the static handler deal with it
		if strings.HasPrefix(r.URL.Path, "/static/") {
			// This will be handled by the static file handler
			return
		}

		// For any other path, redirect to /
		http.Redirect(w, r, "/", http.StatusFound)
	})

	// Serve static files with no directory listing
	http.Handle("/static/", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Remove /static/ prefix to get the file path
		filePath := strings.TrimPrefix(r.URL.Path, "/static/")
		fullPath := filepath.Join("static", filePath)

		// Check if the requested path exists and is not a directory
		info, err := os.Stat(fullPath)
		if err != nil || info.IsDir() {
			// File doesn't exist or is a directory, redirect to /
			http.Redirect(w, r, "/", http.StatusFound)
			return
		}

		// File exists and is not a directory, serve it
		http.ServeFile(w, r, fullPath)
	})) // Get port from environment variable or use default
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	log.Printf("Serving cluster: %s", clusterName)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
