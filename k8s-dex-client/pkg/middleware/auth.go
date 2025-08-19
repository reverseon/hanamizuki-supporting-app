package middleware

import (
	"k8s-dex-client/pkg/auth"
	"net/http"
)

type AuthMode int

const (
	AuthModeAuthenticated AuthMode = iota
	AuthModeUnauthenticated
	AuthModePublic
)

func AuthMiddleware(mode AuthMode) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			_, err := auth.GetUserClaimsFromRequest(r)
			isAuthenticated := err == nil

			switch mode {
			case AuthModeAuthenticated:
				if !isAuthenticated {
					http.Redirect(w, r, "/login", http.StatusFound)
					return
				}
			case AuthModeUnauthenticated:
				if isAuthenticated {
					http.Redirect(w, r, "/", http.StatusFound)
					return
				}
			case AuthModePublic:
				// Allow access regardless of authentication status
			}

			next.ServeHTTP(w, r)
		})
	}
}

func AuthenticatedHandler(handler http.HandlerFunc) http.Handler {
	return AuthMiddleware(AuthModeAuthenticated)(http.HandlerFunc(handler))
}

func UnauthenticatedHandler(handler http.HandlerFunc) http.Handler {
	return AuthMiddleware(AuthModeUnauthenticated)(http.HandlerFunc(handler))
}

func PublicHandler(handler http.HandlerFunc) http.Handler {
	return AuthMiddleware(AuthModePublic)(http.HandlerFunc(handler))
}
