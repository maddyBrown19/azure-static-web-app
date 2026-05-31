import React, { useState } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

function App() {
  const API_BASE_URL = "http://localhost:8080";
  const [selectedGenre, setSelectedGenre] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [spotifyArtists, setSpotifyArtists] = useState();
  const [spotifyPlaylists, setSpotifyPlaylists] = useState();
  const genres = ["pop", "rap", "rock", "hip hop", "classical", "country", "soul", "indie", "latin pop"];

  async function getSpotifyArtists() {
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

  async function getSpotifyPlaylists() {
    try {
      const response = await fetch(`${API_BASE_URL}/playlists/${searchTerm}/${selectedGenre}`);
      if (!response.ok) {
        throw new Error("Playlists from Spotify not found");
      }
      var playlists = await response.json();
    } catch (error) {
      console.error(error);
    }
    console.log(playlists)
    return playlists;
  }

  async function handleGetSpotifyArtists() {
    const returnedArtists = await getSpotifyArtists()
    if (returnedArtists) {
      setSpotifyArtists(returnedArtists)
    } else {
      setSpotifyArtists("Oops! No artists were found. Change your search query and try again.")
    }
  }

  async function handleGetSpotifyPlaylists() {
    const returnedPlaylists = await getSpotifyPlaylists()
    if (returnedPlaylists) {
      setSpotifyPlaylists(returnedPlaylists)
    } else {
      setSpotifyPlaylists("Oops! No playlists were found. Change your search query and try again.")
    }
  }

  return (
    <span style={{ fontFamily: "Monaco" }}>
      <h1 style={{ textAlign: "center", paddingTop: 20 }}>Mixtape</h1>
      <h3 style={{ textAlign: "center", fontStyle: "italic" }}>A music recommendation platform</h3>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 20, paddingBottom: 20 }}>
        <input
          type="text"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          style={{ width: 250 }}
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
          <Button variant="outlined" style={{ color: "blue", fontFamily: "Monaco" }} onClick={() => handleGetSpotifyArtists(searchTerm, selectedGenre)}>Generate recommended artists</Button>
          <Button variant="outlined" style={{ color: "blue", fontFamily: "Monaco" }} onClick={() => handleGetSpotifyPlaylists(searchTerm, selectedGenre)}>Generate recommended playlists</Button>
        </Stack>
      </div>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        {spotifyArtists && (
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <p style={{ fontStyle: "oblique" }}>Based on your search, you might like these artists. Click to open their Spotify page.</p>
            {typeof spotifyArtists === "string" ? (
              <h3 style={{ color: "gray" }}>{spotifyArtists}</h3>
            ) : (
              spotifyArtists.map((artist, index) => (
                <a href={artist.Url} target="_blank" rel="noopener noreferrer" key={index}>
                  <h3 style={{ color: "blue" }}>{artist.Name}</h3>
                </a>
              ))
            )}
          </div>
        )}
        {spotifyPlaylists && (
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <p style={{ fontStyle: "oblique" }}>Based on your search, you might like these playlists. Click to open them in Spotify.</p>
            {typeof spotifyPlaylists === "string" ? (
              <h3 style={{ color: "gray" }}>{spotifyPlaylists}</h3>
            ) : (
              spotifyPlaylists.map((playlist, index) => (
                <a href={playlist.Url} target="_blank" rel="noopener noreferrer" key={index}>
                  <h3 style={{ color: "blue" }}>{playlist.Name}</h3>
                </a>
              ))
            )}
          </div>
        )}
      </div>
    </span>
  );
}

export default App;
