import React, { useState, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

function App() {
  const API_BASE_URL = "http://localhost:8080";
  const [artistNames, setArtistNames] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [artistFollowers, setArtistFollowers] = useState("");
  const [artistMostPopularSong, setArtistMostPopularSong] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [spotifyArtists, setSpotifyArtists] = useState("");
  const genres = ["pop", "rap", "rock", "urbano latino", "hip hop", "reggaeton", "country", "k-pop", "indie", "singer-songwriter"];

  useEffect(() => {
    async function loadInitialData() {
      try {
        const response = await fetch(`${API_BASE_URL}/artistNames`);
        const names = await response.json();
        const namesAlphabeticalOrder = [...names].sort((a, b) => a.localeCompare(b));
        setArtistNames(namesAlphabeticalOrder);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    loadInitialData();
  }, []);

  async function getFollowersByArtist(name) {
    try {
      const response = await fetch(`${API_BASE_URL}/artistData/${encodeURIComponent(name)}/artistFollowers`);
      if (!response.ok) {
        throw new Error("Follower count not found");
      }
      var followers = await response.json();
    } catch (error) {
      console.error(error);
    }
    return followers;
  }

  async function getMostPopularSongByArtist(name) {
    try {
      const response = await fetch(`${API_BASE_URL}/artistData/${encodeURIComponent(name)}/artistMostPopularSong`);
      if (!response.ok) {
        throw new Error("Most popular song not found");
      }
      var mostPopularSong = await response.json();
    } catch (error) {
      console.error(error);
    }
    return mostPopularSong;
  }

  async function getSpotifyArtists(searchTerm, genre) {
    try {
      const response = await fetch(`${API_BASE_URL}/artists/${searchTerm}/${selectedGenre}`);
      if (!response.ok) {
        throw new Error("Artists from Spotify not found");
      }
      var artists = await response.json();
    } catch (error) {
      console.error(error);
    }
    return artists;
  }

  /*
  const handleSelectedArtistChange = (e) => {
    setSelectedArtist(e.target.value);
  };

  async function handleFollowersClick() {
    const followersByArtist = await getFollowersByArtist(selectedArtist)
    if (followersByArtist) {
      setArtistFollowers(`${selectedArtist} has ${parseInt(followersByArtist, 10).toLocaleString()} followers`);
    }
  };
  */

  /*
  async function handleArtistMostPopularSongClick() {
    const mostPopularSongByArtist = await getMostPopularSongByArtist(selectedArtist)
    if (mostPopularSongByArtist) {
      setArtistMostPopularSong(`${selectedArtist}'s most popular song in 2025 was "${mostPopularSongByArtist.Song}" with a popularity rating of ${mostPopularSongByArtist.Popularity}/100`);
    }
  }
    */

  async function handleGetSpotifyArtists() {
    console.log("The current search term is: ", searchTerm)
    const returnedArtists = await getSpotifyArtists()
    if (returnedArtists) {
      setSpotifyArtists(`${returnedArtists}`)
    }
    console.log("ARTISTS", returnedArtists)
  }

  if (!isLoading) {
    return (
      <span style={{ fontFamily: "Monaco" }}>
        <h1 style={{ textAlign: "center", paddingTop: 20 }}>Mixtape</h1>
        <h3 style={{ textAlign: "center", fontStyle: "italic"}}>A music recommendation platform</h3>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 20, paddingBottom: 20 }}>
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            style={{width: 250}}
            placeholder="What do you want to listen to?"
          />
          <label>
            <select name="selectedGenre" value={selectedGenre} onChange={(event) => setSelectedGenre(event.target.value)}>
            <option value="">Choose a genre</option>
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
            </select>
          </label>
        </div>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Stack spacing={2} direction="row">
            <Button variant="outlined" onClick={() => handleGetSpotifyArtists(searchTerm, selectedGenre)}>Generate recommended artists</Button>
          </Stack>
        </div>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
          <p>{artistFollowers}</p>
          <p>{artistMostPopularSong}</p>
          <p>{spotifyArtists}</p>
        </div>
      </span>
    );
  }
}

export default App;
