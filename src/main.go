package main

import (
	"encoding/csv"
	"encoding/json"
	"slices"

	//"fmt"
	"log"
	"net/http"
	"os"
	//"strings"
)

/*
type artist struct {
	Name             string `json:"name"`
	MonthlyListeners int    `json:"monthlyListeners"`
	MostStreamedSong string `json:"mostStreamedSong"`
}
*/

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

/*
var artists = []artist{
	{Name: "Maggie Rogers", MonthlyListeners: 7089646, MostStreamedSong: "Dawns (feat. Maggie Rogers)"},
	{Name: "Lorde", MonthlyListeners: 27123369, MostStreamedSong: "Ribs"},
	{Name: "Renee Rapp", MonthlyListeners: 4996396, MostStreamedSong: "I Think I Like You Better When You're Gone"},
	{Name: "Morgan Wallen", MonthlyListeners: 32830914, MostStreamedSong: "I Had Some Help (feat. Morgan Wallen)"},
	{Name: "Bon Iver", MonthlyListeners: 16094296, MostStreamedSong: "exile (feat. Bon Iver)"},
	{Name: "Olivia Dean", MonthlyListeners: 61943515, MostStreamedSong: "Man I Need"},
	{Name: "Anya Gupta", MonthlyListeners: 3280, MostStreamedSong: "you ruined phoebe bridgers"},
	{Name: "Billie Eilish", MonthlyListeners: 84774525, MostStreamedSong: "BIRDS OF A FEATHER"},
	{Name: "Gracie Abrams", MonthlyListeners: 34874334, MostStreamedSong: "That's So True"},
	{Name: "Ethel Cain", MonthlyListeners: 3442765, MostStreamedSong: "Crush"},
} */

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

/*

func getSelectedDataByArtist(w http.ResponseWriter, r *http.Request) {
	name := r.PathValue("name")
	data := r.PathValue("data")
	var selectedArtist artist
	foundArtist := false
	for _, artist := range artists {
		if artist.Name == name {
			selectedArtist = artist
			foundArtist = true
			break
		}
	}
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
	if !foundArtist {
		w.WriteHeader(http.StatusNotFound)
	} else {
		w.WriteHeader(http.StatusOK)
		switch data {
		case "monthlyListeners":
			json.NewEncoder(w).Encode(selectedArtist.MonthlyListeners)
		case "mostStreamedSong":
			json.NewEncoder(w).Encode(selectedArtist.MostStreamedSong)
		}
	}
}
*/

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /artistNames", getArtistNames)
	mux.HandleFunc("GET /artistData/{name}", getDataByArtist)
	mux.HandleFunc("GET /artistData/{name}/artistFollowers", getFollowersByArtist)
	//mux.HandleFunc("GET /artist/{name}/{data}", getSelectedDataByArtist)
	http.ListenAndServe(":8080", mux)
}
