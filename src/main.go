package main

import (
	"cmp"
	"encoding/base64"
	"encoding/csv"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"os"
	"slices"
	"strconv"
	"strings"
)

type DataRow struct {
	TrackID          string `json:"trackID"`
	TrackName        string `json:"trackName"`
	TrackNumber      string `json:"trackNumber"`
	TrackPopularity  string `json:"trackPopularity"`
	Explicit         string `json:"explicit"`
	ArtistName       string `json:"artistName"`
	ArtistPopularity string `json:"artistPopularity"`
	ArtistFollowers  string `json:"artistFollowers"`
	ArtistGenres     string `json:"artistGenres"`
	AlbumID          string `json:"albumID"`
	AlbumName        string `json:"albumName"`
	AlbumReleaseDate string `json:"albumReleaseDate"`
	AlbumTotalTracks string `json:"albumTotalTracks"`
	AlbumType        string `json:"albumType"`
	TrackDurationMin string `json:"trackDurationMin"`
}

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

func callAnySpotifyAPI(apiUrl string, authToken string) (string, error) {
	// Might not end up needing this function
	request, err := http.NewRequest("GET", apiUrl, nil)
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

func getArtistsFromSpotifySearchAPI(query string, authToken string) ([]string, error) {
	var searchResult map[string]interface{}
	var artistsResult []string
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
		name := artist["name"].(string)
		artistsResult = append(artistsResult, name)
	}
	return artistsResult, nil
}

func parseSpotifyData(data [][]string) []DataRow {
	var spotifyData []DataRow
	for i, line := range data {
		if i == 0 || len(line) < 15 {
			continue
		}
		var row DataRow
		for j, value := range line {
			switch j {
			case 0:
				row.TrackID = value
			case 1:
				row.TrackName = value
			case 2:
				row.TrackNumber = value
			case 3:
				row.TrackPopularity = value
			case 4:
				row.Explicit = value
			case 5:
				row.ArtistName = value
			case 6:
				row.ArtistPopularity = value
			case 7:
				row.ArtistFollowers = value
			case 8:
				row.ArtistGenres = value
			case 9:
				row.AlbumID = value
			case 10:
				row.AlbumName = value
			case 11:
				row.AlbumReleaseDate = value
			case 12:
				row.AlbumTotalTracks = value
			case 13:
				row.AlbumType = value
			case 14:
				row.TrackDurationMin = value
			}
		}
		spotifyData = append(spotifyData, row)
	}
	return spotifyData
}

func getSpotifyData() []DataRow {
	file, e := os.Open("spotify_data.csv")
	if e != nil {
		log.Fatal(e)
	}
	defer file.Close()
	reader := csv.NewReader(file)
	reader.LazyQuotes = true
	reader.FieldsPerRecord = -1
	data, e := reader.ReadAll()
	if e != nil {
		log.Fatal(e)
	}
	parsedSpotifyData := parseSpotifyData(data)
	return parsedSpotifyData
}

var data []DataRow = getSpotifyData()

func filterDataByArtist(name string) []DataRow {
	var artistData []DataRow
	for _, row := range data {
		if row.ArtistName == name {
			artistData = append(artistData, row)
		}
	}
	return artistData
}

func getArtistNames(w http.ResponseWriter, r *http.Request) {
	var names []string
	for _, dataRow := range data {
		if !slices.Contains(names, dataRow.ArtistName) {
			names = append(names, dataRow.ArtistName)
		}
	}
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(names)
}

func getDataByArtist(w http.ResponseWriter, r *http.Request) {
	artistData := filterDataByArtist(r.PathValue("name"))
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(artistData)
}

func getFollowersByArtist(w http.ResponseWriter, r *http.Request) {
	artistData := filterDataByArtist(r.PathValue("name"))
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(artistData[0].ArtistFollowers)
}

func getMostPopularSongByArtist(w http.ResponseWriter, r *http.Request) {
	type SongPopularityPair struct {
		Song       string
		Popularity int
	}
	artistData := filterDataByArtist(r.PathValue("name"))
	var popularityBySong []SongPopularityPair
	for _, dataRow := range artistData {
		songPopularityAsInteger, e := strconv.Atoi(dataRow.TrackPopularity)
		if e != nil {
			log.Fatal(e)
		}
		popularityBySong = append(popularityBySong, SongPopularityPair{dataRow.TrackName, songPopularityAsInteger})
	}
	mostPopularSong := slices.MaxFunc(popularityBySong, func(a, b SongPopularityPair) int {
		return cmp.Compare(a.Popularity, b.Popularity)
	})
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(mostPopularSong)
}

func main() {
	//mux := http.NewServeMux()
	//mux.HandleFunc("GET /artistNames", getArtistNames)
	//mux.HandleFunc("GET /artistData/{name}", getDataByArtist)
	//mux.HandleFunc("GET /artistData/{name}/artistFollowers", getFollowersByArtist)
	//mux.HandleFunc("GET /artistData/{name}/artistMostPopularSong", getMostPopularSongByArtist)
	//http.ListenAndServe(":8080", mux)
	query := "dance genre:pop"
	clientID := "2d14c078f82b4e67869594caa4426e3e"
	clientSecret := "d33c5c44eb4940eca08a0f5162dc556c"
	authToken, authErr := getSpotifyAuthToken(clientID, clientSecret)
	if authErr != nil {
		fmt.Printf("There was an error generating the auth token: %s", authErr)
	}
	result, err := getArtistsFromSpotifySearchAPI(query, authToken)
	if err != nil {
		fmt.Printf("There was an error extracting data about artists from the search endpoint: %s", err)
	}
	fmt.Printf("%+v", result)
}
