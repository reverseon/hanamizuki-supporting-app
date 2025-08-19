package login

import (
	"bytes"
	"html/template"
	"log"
	"net/http"
	"os"
)

func mainHandler(w http.ResponseWriter, r *http.Request) {
	tmpl, err := template.ParseFiles("templates/login.html")
	if err != nil {
		http.Error(w, "Error loading template", http.StatusInternalServerError)
		log.Printf("Template error: %v", err)
		return
	}

	clusterName := os.Getenv("CLIENT_CLUSTER_NAME")
	if clusterName == "" {
		clusterName = "Default"
	}

	data := map[string]string{
		"ClusterName": clusterName,
	}

	var buf bytes.Buffer
	err = tmpl.Execute(&buf, data)
	if err != nil {
		http.Error(w, "Error executing template", http.StatusInternalServerError)
		log.Printf("Template execution error: %v", err)
		return
	}
	w.Write(buf.Bytes())
}

func GetHandler() func(http.ResponseWriter, *http.Request) {
	return mainHandler
}
