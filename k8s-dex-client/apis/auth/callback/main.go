package callback

import (
	"context"
	"fmt"
	"net/http"
	"os"

	"github.com/coreos/go-oidc/v3/oidc"
	"golang.org/x/oauth2"
)

type app struct {
	clientID     string
	clientSecret string
	redirectURI  string
	verifier     *oidc.IDTokenVerifier
	provider     *oidc.Provider
	oauth2Config *oauth2.Config
	offlineAsScope bool
}

var appInstance *app

func initApp() error {
	if appInstance != nil {
		return nil
	}

	clientID := os.Getenv("CLIENT_ID")
	clientSecret := os.Getenv("CLIENT_SECRET")
	issuerURL := os.Getenv("OIDC_ISSUER")
	callbackURL := os.Getenv("CALLBACK_URL")

	if clientID == "" || clientSecret == "" || issuerURL == "" || callbackURL == "" {
		return fmt.Errorf("missing environment variables: CLIENT_ID, CLIENT_SECRET, OIDC_ISSUER, CALLBACK_URL")
	}

	ctx := context.Background()
	provider, err := oidc.NewProvider(ctx, issuerURL)
	if err != nil {
		return fmt.Errorf("failed to query provider %q: %v", issuerURL, err)
	}

	verifier := provider.Verifier(&oidc.Config{ClientID: clientID})

	// Check if provider supports offline_access scope
	var s struct {
		ScopesSupported []string `json:"scopes_supported"`
	}
	offlineAsScope := true // Default to true if scopes_supported is missing
	if err := provider.Claims(&s); err == nil && len(s.ScopesSupported) > 0 {
		offlineAsScope = false
		for _, scope := range s.ScopesSupported {
			if scope == oidc.ScopeOfflineAccess {
				offlineAsScope = true
				break
			}
		}
	}

	scopes := []string{oidc.ScopeOpenID, "profile", "email", "groups"}
	if offlineAsScope {
		scopes = append(scopes, "offline_access")
	}

	oauth2Config := &oauth2.Config{
		ClientID:     clientID,
		ClientSecret: clientSecret,
		RedirectURL:  callbackURL,
		Endpoint:     provider.Endpoint(),
		Scopes:       scopes,
	}

	appInstance = &app{
		clientID:     clientID,
		clientSecret: clientSecret,
		redirectURI:  callbackURL,
		verifier:     verifier,
		provider:     provider,
		oauth2Config: oauth2Config,
		offlineAsScope: offlineAsScope,
	}

	return nil
}

func handleCallback(w http.ResponseWriter, r *http.Request) {
	if err := initApp(); err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	stateCookie, err := r.Cookie("oauth_state")
	if err != nil {
		http.Error(w, "State cookie not found", http.StatusBadRequest)
		return
	}

	if r.URL.Query().Get("state") != stateCookie.Value {
		http.Error(w, "Invalid state parameter", http.StatusBadRequest)
		return
	}

	code := r.URL.Query().Get("code")
	if code == "" {
		http.Error(w, "No authorization code", http.StatusBadRequest)
		return
	}

	ctx := context.Background()
	token, err := appInstance.oauth2Config.Exchange(ctx, code)
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to exchange token: %v", err), http.StatusInternalServerError)
		return
	}

	rawIDToken, ok := token.Extra("id_token").(string)
	if !ok {
		http.Error(w, "No id_token field in oauth2 token", http.StatusInternalServerError)
		return
	}

	idToken, err := appInstance.verifier.Verify(ctx, rawIDToken)
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to verify ID Token: %v", err), http.StatusInternalServerError)
		return
	}

	var claims struct {
		Email         string   `json:"email"`
		PreferredName string   `json:"preferred_username"`
		Groups        []string `json:"groups"`
	}
	if err := idToken.Claims(&claims); err != nil {
		http.Error(w, fmt.Sprintf("Failed to parse claims: %v", err), http.StatusInternalServerError)
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:   "oauth_state",
		Value:  "",
		Path:   "/",
		MaxAge: -1,
	})

	http.SetCookie(w, &http.Cookie{
		Name:     "access_token",
		Value:    token.AccessToken,
		Path:     "/",
		HttpOnly: true,
		Secure:   false,
	})

	http.SetCookie(w, &http.Cookie{
		Name:     "id_token",
		Value:    rawIDToken,
		Path:     "/",
		HttpOnly: true,
		Secure:   false,
	})

	if token.RefreshToken != "" {
		http.SetCookie(w, &http.Cookie{
			Name:     "refresh_token",
			Value:    token.RefreshToken,
			Path:     "/",
			HttpOnly: true,
			Secure:   false,
		})
	}

	http.Redirect(w, r, "/", http.StatusFound)
}

func GetHandler() func(http.ResponseWriter, *http.Request) {
	return handleCallback
}
