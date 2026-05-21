package main

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"strings"
)

const CLIENT_ID = "2d14c078f82b4e67869594caa4426e3e"
const CLIENT_SECRET = "d33c5c44eb4940eca08a0f5162dc556c"

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

func callSpotifySearchAPI(query string, authToken string) (string, error) {
	baseApiUrl := "https://api.spotify.com/v1/search"
	parameters := url.Values{}
	parameters.Add("q", query)
	parameters.Add("type", "artist,album")
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

func getArtistsFromSpotifySearchAPI(query string, authToken string) (string, error) {
	var searchResult map[string]interface{}
	var artistsResult []string
	search, searchErr := callSpotifySearchAPI(query, authToken)
	if searchErr != nil {
		return "", searchErr
	}
	unpackErr := json.Unmarshal([]byte(search), &searchResult)
	if unpackErr != nil {
		return "", unpackErr
	}
	artists := searchResult["artists"].(map[string]interface{})
	items := artists["items"].([]interface{})
	for _, item := range items {
		artist := item.(map[string]interface{})
		name := artist["name"].(string)
		artistsResult = append(artistsResult, name)
	}
	formattedResult := strings.Join(artistsResult, ", ")
	return formattedResult, nil
}

func getArtistsFromSearch(w http.ResponseWriter, r *http.Request) {
	searchTerm := r.PathValue("searchTerm")
	genre := r.PathValue("genre")
	query := fmt.Sprintf("%s genre:%s", searchTerm, genre)
	authToken, authErr := getSpotifyAuthToken(CLIENT_ID, CLIENT_SECRET)
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
