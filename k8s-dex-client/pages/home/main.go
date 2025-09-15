package home

import (
	"bytes"
	"html/template"
	"k8s-dex-client/pkg/auth"
	"log"
	"net/http"
	"os"
)

func mainHandler(w http.ResponseWriter, r *http.Request) {
	claims, err := auth.GetUserClaimsFromRequest(r)
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		log.Printf("Failed to get user claims: %v", err)
		return
	}

	tmpl, err := template.ParseFiles("templates/main.html")
	if err != nil {
		http.Error(w, "Error loading template", http.StatusInternalServerError)
		log.Printf("Template error: %v", err)
		return
	}

	clusterName := os.Getenv("CLIENT_CLUSTER_NAME")
	if clusterName == "" {
		http.Error(w, "Something went wrong", http.StatusInternalServerError)
		log.Printf("Missing environment variable: CLUSTER_NAME")
		return
	}

	apiServerURL := os.Getenv("APISERVER_URL")
	if apiServerURL == "" {
		http.Error(w, "Something went wrong", http.StatusInternalServerError)
		log.Printf("Missing environment variable: APISERVER_URL")
		return
	}

	idpIssuerURL := os.Getenv("OIDC_ISSUER")
	if idpIssuerURL == "" {
		http.Error(w, "Something went wrong", http.StatusInternalServerError)
		log.Printf("Missing environment variable: OIDC_ISSUER")
		return
	}

	clientID := os.Getenv("CLIENT_ID")
	if clientID == "" {
		http.Error(w, "Something went wrong", http.StatusInternalServerError)
		log.Printf("Missing environment variable: CLIENT_ID")
		return
	}

	clientSecret := os.Getenv("CLIENT_SECRET")
	if clientSecret == "" {
		http.Error(w, "Something went wrong", http.StatusInternalServerError)
		log.Printf("Missing environment variable: CLIENT_SECRET")
		return
	}

	// Get tokens from cookies
	var idToken, refreshToken string
	if idTokenCookie, err := r.Cookie("id_token"); err == nil {
		idToken = idTokenCookie.Value
	}
	if refreshTokenCookie, err := r.Cookie("refresh_token"); err == nil {
		refreshToken = refreshTokenCookie.Value
	}

	data := struct {
		ClusterName  string
		APIServerURL string
		IDPIssuerURL string
		ClientID     string
		ClientSecret string
		IDToken      string
		Username     string
		RefreshToken string
		Production   bool
	}{
		ClusterName:  clusterName,
		APIServerURL: apiServerURL,
		IDPIssuerURL: idpIssuerURL,
		ClientID:     clientID,
		ClientSecret: clientSecret,
		Username:     claims.PreferredName,
		IDToken:      idToken,
		RefreshToken: refreshToken,
		Production:   os.Getenv("GO_ENV") == "production",
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
