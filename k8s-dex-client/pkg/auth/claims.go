package auth

import (
	"context"
	"fmt"
	"net/http"
	"os"

	"github.com/coreos/go-oidc/v3/oidc"
	"golang.org/x/oauth2"
)

type UserClaims struct {
	Email         string   `json:"email"`
	PreferredName string   `json:"preferred_username"`
	Groups        []string `json:"groups"`
}

type ClaimsProvider struct {
	provider *oidc.Provider
	clientID string
}

var claimsProvider *ClaimsProvider

func initClaimsProvider() error {
	if claimsProvider != nil {
		return nil
	}

	clientID := os.Getenv("CLIENT_ID")
	issuerURL := os.Getenv("OIDC_ISSUER")

	if clientID == "" || issuerURL == "" {
		return fmt.Errorf("missing environment variables: CLIENT_ID, OIDC_ISSUER")
	}

	ctx := context.Background()
	provider, err := oidc.NewProvider(ctx, issuerURL)
	if err != nil {
		return fmt.Errorf("failed to query provider %q: %v", issuerURL, err)
	}

	claimsProvider = &ClaimsProvider{
		provider: provider,
		clientID: clientID,
	}

	return nil
}

func GetUserClaims(accessToken string) (*UserClaims, error) {
	if err := initClaimsProvider(); err != nil {
		return nil, err
	}

	ctx := context.Background()
	userInfo, err := claimsProvider.provider.UserInfo(ctx, oauth2.StaticTokenSource(&oauth2.Token{AccessToken: accessToken}))
	if err != nil {
		return nil, fmt.Errorf("failed to get userinfo: %v", err)
	}

	var claims UserClaims
	if err := userInfo.Claims(&claims); err != nil {
		return nil, fmt.Errorf("failed to parse claims: %v", err)
	}

	return &claims, nil
}

func GetUserClaimsFromRequest(r *http.Request) (*UserClaims, error) {
	accessTokenCookie, err := r.Cookie("access_token")
	if err != nil {
		return nil, fmt.Errorf("access token cookie not found: %v", err)
	}

	return GetUserClaims(accessTokenCookie.Value)
}
