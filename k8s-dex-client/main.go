package main

import (
	"k8s-dex-client/apis/auth/callback"
	"k8s-dex-client/apis/auth/github"
	"k8s-dex-client/apis/auth/logout"
	"k8s-dex-client/pages/home"
	"k8s-dex-client/pages/login"
	"k8s-dex-client/pages/static"
	"k8s-dex-client/pkg/middleware"
	"log"
	"net/http"
	"os"
)

func main() {
	// Pages
	http.Handle("/login", middleware.UnauthenticatedHandler(login.GetHandler()))
	http.Handle("/static/", http.StripPrefix("/static/", middleware.PublicHandler(static.GetHandler())))
	http.Handle("/", middleware.AuthenticatedHandler(home.GetHandler()))
	// APIs
	http.Handle("/apis/auth/github", middleware.UnauthenticatedHandler(github.GetHandler()))
	http.Handle("/apis/auth/callback", middleware.UnauthenticatedHandler(callback.GetHandler()))
	http.Handle("/apis/auth/logout", middleware.AuthenticatedHandler(logout.GetHandler()))

	port := os.Getenv("PORT")
	if port == "" {
		log.Fatal("Missing environment variable: PORT")
	}

	log.Printf("Server starting on :%s", port)
	if err := http.ListenAndServe(":"+port, nil); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}
