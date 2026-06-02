package main

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"os"
	"strings"

	"github.com/joho/godotenv"
)

type ArtistResult struct {
	Name string
	Url  string
}

/*
	Authenticates the user based on their Spotify client ID and secret. The ID and secret should

be defined in the user's .env file.
*/
func getSpotifyAuthToken(clientID, clientSecret string) (string, error) {
	clientData := base64.StdEncoding.EncodeToString([]byte(clientID + ":" + clientSecret))
	authData := url.Values{}
	authData.Set("grant_type", "client_credentials")
	request, _ := http.NewRequest("POST", "https://accounts.spotify.com/api/token", strings.NewReader(authData.Encode()))
	request.Header.Add("Authorization", "Basic "+clientData)
	request.Header.Add("Content-Type", "application/x-www-form-urlencoded")
	client := &http.Client{}
	response, err := client.Do(request)
	if err != nil {
		return "", err
	}
	defer response.Body.Close()
	var result map[string]interface{}
	json.NewDecoder(response.Body).Decode(&result)
	return result["access_token"].(string), nil
}

/* Calls Spotify's /search API with a given query. */
func callSpotifySearchAPI(query string, authToken string) (string, error) {
	baseApiUrl := "https://api.spotify.com/v1/search"
	parameters := url.Values{}
	parameters.Add("q", query)
	parameters.Add("type", "artist")
	parameters.Add("limit", "5")
	fullApiUrl := fmt.Sprintf("%s?%s", baseApiUrl, parameters.Encode())
	request, err := http.NewRequest("GET", fullApiUrl, nil)
	if err != nil {
		return "", err
	}
	request.Header.Set("Authorization", "Bearer "+authToken)
	client := &http.Client{}
	response, err := client.Do(request)
	if err != nil {
		return "", err
	}
	defer response.Body.Close()
	body, err := io.ReadAll(response.Body)
	if err != nil {
		return "", err
	}
	return string(body), nil
}

/* Extracts the returned artists from the /search Spotify API call. */
func getArtistsFromSpotifySearchAPI(query string, authToken string) ([]ArtistResult, error) {
	var searchResult map[string]interface{}
	var artistsResult []ArtistResult
	search, searchErr := callSpotifySearchAPI(query, authToken)
	if searchErr != nil {
		return nil, searchErr
	}
	unpackErr := json.Unmarshal([]byte(search), &searchResult)
	if unpackErr != nil {
		return nil, unpackErr
	}
	artists := searchResult["artists"].(map[string]interface{})
	items := artists["items"].([]interface{})
	for _, item := range items {
		artist := item.(map[string]interface{})
		artistName := artist["name"].(string)
		urls := artist["external_urls"].(map[string]interface{})
		artistUrl := urls["spotify"].(string)
		artistsResult = append(artistsResult, ArtistResult{Name: artistName, Url: artistUrl})
	}
	return artistsResult, nil
}

/*
	Builds a response for this app's /artists/{searchTerm}/{genre} API. Authenticates the

Spotify user and generates artist recommendations based on the user's query. The user's
query includes a search term and a genre selection.
*/
func getArtistsFromSearch(w http.ResponseWriter, r *http.Request) {
	searchTerm := r.PathValue("searchTerm")
	genre := r.PathValue("genre")
	query := fmt.Sprintf("%s genre:%s", searchTerm, genre)
	envErr := godotenv.Load()
	if envErr != nil {
		log.Fatal("Error loading .env file")
	}
	spotifyClientId := os.Getenv("SPOTIFY_CLIENT_ID")
	spotifyClientSecret := os.Getenv("SPOTIFY_CLIENT_SECRET")
	authToken, authErr := getSpotifyAuthToken(spotifyClientId, spotifyClientSecret)
	if authErr != nil {
		log.Fatal(authErr)
	}
	result, resultErr := getArtistsFromSpotifySearchAPI(query, authToken)
	if resultErr != nil {
		log.Fatal(resultErr)
	}
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(result)
}

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /artists/{searchTerm}/{genre}", getArtistsFromSearch)
	http.ListenAndServe(":8080", mux)
}
