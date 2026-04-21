package main

import (
	"encoding/json"
	"net/http"
)

type artist struct {
	Name             string `json:"name"`
	MonthlyListeners int    `json:"monthlyListeners"`
	MostStreamedSong string `json:"mostStreamedSong"`
}

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
}

func getArtist(w http.ResponseWriter, r *http.Request) {
	name := r.PathValue("name")
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
		json.NewEncoder(w).Encode(selectedArtist)
	}
}

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /artist/{name}", getArtist)
	http.ListenAndServe(":8080", mux)
}
