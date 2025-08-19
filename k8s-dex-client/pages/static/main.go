package static

import (
	"net/http"
)

func GetHandler() func(http.ResponseWriter, *http.Request) {
	return http.FileServer(http.Dir("static/")).ServeHTTP
}
