import React, { useState } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

function App() {
  const API_BASE_URL = "http://localhost:8080";
  const [selectedArtist, setSelectedArtist] = useState("");
  const [monthlyListeners, setMonthlyListeners] = useState("");
  const [mostStreamedSong, setMostStreamedSong] = useState("");

  const artists = ["Maggie Rogers", "Lorde", "Renee Rapp", "Morgan Wallen", "Bon Iver", "Olivia Dean", 
    "Anya Gupta", "Billie Eilish", "Gracie Abrams", "Ethel Cain"];

  async function getAllDataByArtist(name) {
    try {
      const response = await fetch(`${API_BASE_URL}/artist/${encodeURIComponent(name)}`);
      if (!response.ok) {
        throw new Error("Artist not found");
      }
    var artist = await response.json();
    } catch (error) {
      console.error("Error finding the artist:", error);
    }
    return artist;
  }

  async function getMonthlyListenersByArtist(name) {
    try {
      const response = await fetch(`${API_BASE_URL}/artist/${encodeURIComponent(name)}/monthlyListeners`);
      if (!response.ok) {
        throw new Error("Artist's monthly listeners not found");
      }
    var monthlyListeners = await response.json();
    } catch (error) {
      console.error("Error finding the artist's monthly listeners:", error);
    }
    return monthlyListeners;
  }

  async function getMostStreamedSongByArtist(name) {
    try {
      const response = await fetch(`${API_BASE_URL}/artist/${encodeURIComponent(name)}/mostStreamedSong`);
      if (!response.ok) {
        throw new Error("Artist's most streamed song not found");
      }
    var mostStreamedSong = await response.json();
    } catch (error) {
      console.error("Error finding the artist's most streamed song:", error);
    }
    return mostStreamedSong;
  }

  const handleSelectedArtistChange = (e) => {
    setSelectedArtist(e.target.value);
  };

  async function handleMonthlyListenerCountClick() {
    const artistMonthlyListeners = await getMonthlyListenersByArtist(selectedArtist);
    if (artistMonthlyListeners) {
      setMonthlyListeners(`${selectedArtist} has ${artistMonthlyListeners.toLocaleString()} monthly listeners`);
    }
  };

  async function handleMostStreamedSongClick() {
    const artistMostStreamedSong = await getMostStreamedSongByArtist(selectedArtist);
    if (artistMostStreamedSong) {
      setMostStreamedSong(`${selectedArtist}'s most streamed song is "${artistMostStreamedSong}"`);
    }
  };

  return (
    <span style={{fontFamily: "Monaco"}}>
      <h1 style={{textAlign: "center", paddingTop: 20}}>Learn about Spotify artists</h1>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", paddingBottom: 20 }}>
        <label>
          <select name="selectedArtist" value={selectedArtist} onChange={handleSelectedArtistChange}>
            <option value="">Choose an artist...</option>
            {artists.map((artist) => (
              <option key={artist} value={artist}>
                {artist}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Stack spacing={2} direction="row">
          <Button variant="outlined" onClick={() => handleMonthlyListenerCountClick(selectedArtist)}>Monthly listener count</Button>
          <Button variant="outlined" onClick={() => handleMostStreamedSongClick(selectedArtist)}>Most streamed song</Button>
        </Stack>
      </div>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        <p>{monthlyListeners}</p>
        <p>{mostStreamedSong}</p>
      </div>
    </span>
  );
}

export default App;
