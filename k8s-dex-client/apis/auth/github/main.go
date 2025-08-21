package github

import (
	"context"
	"crypto/rand"
	"encoding/base64"
	"fmt"
	"log"
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

func generateState() (string, error) {
	b := make([]byte, 32)
	_, err := rand.Read(b)
	if err != nil {
		return "", err
	}
	return base64.URLEncoding.EncodeToString(b), nil
}

func mainHandler(w http.ResponseWriter, r *http.Request) {
	if err := initApp(); err != nil {
		log.Printf("Failed to initialize app: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	switch r.Method {
	case http.MethodPost:
		handleLogin(w, r)
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

func handleLogin(w http.ResponseWriter, r *http.Request) {
	state, err := generateState()
	if err != nil {
		http.Error(w, "Failed to generate state", http.StatusInternalServerError)
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "oauth_state",
		Value:    state,
		Path:     "/",
		HttpOnly: true,
		Secure:   false, // Set to true in production with HTTPS
	})

	authURL := appInstance.oauth2Config.AuthCodeURL(state)
	http.Redirect(w, r, authURL, http.StatusFound)
}

func GetHandler() func(http.ResponseWriter, *http.Request) {
	return mainHandler
}
