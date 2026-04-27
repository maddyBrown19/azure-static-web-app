import React, { useState, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

function App() {
  const API_BASE_URL = "http://localhost:8080";
  const [artistNames, setArtistNames] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedArtist, setSelectedArtist] = useState("");
  const [monthlyListeners, setMonthlyListeners] = useState("");
  const [mostStreamedSong, setMostStreamedSong] = useState("");

  // Fetch data needed to render the UI (names of artists for the dropdown) 
  useEffect(() => {
    async function loadInitialData() {
      try {
        const response = await fetch(`${API_BASE_URL}/artistNames`);
        const names = await response.json();
        setArtistNames(names);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    loadInitialData();
  }, []);

  async function getSelectedDataByArtist(name, data, error) {
    try {
      const response = await fetch(`${API_BASE_URL}/artist/${encodeURIComponent(name)}/${data}`);
      if (!response.ok) {
        throw new Error(error);
      }
      var data = await response.json();
    } catch (e) {
      console.error(e);
    }
    return data;
  }

  const handleSelectedArtistChange = (e) => {
    setSelectedArtist(e.target.value);
  };

  async function handleMonthlyListenerCountClick() {
    const artistMonthlyListeners = await getSelectedDataByArtist(selectedArtist, "monthlyListeners", "Artist's monthly listeners not found");
    if (artistMonthlyListeners) {
      setMonthlyListeners(`${selectedArtist} has ${artistMonthlyListeners.toLocaleString()} monthly listeners`);
    }
  };

  async function handleMostStreamedSongClick() {
    const artistMostStreamedSong = await getSelectedDataByArtist(selectedArtist, "mostStreamedSong", "Artist's most streamed song not found");
    if (artistMostStreamedSong) {
      setMostStreamedSong(`${selectedArtist}'s most streamed song is "${artistMostStreamedSong}"`);
    }
  };

  if (!isLoading) {
    return (
      <span style={{ fontFamily: "Monaco" }}>
        <h1 style={{ textAlign: "center", paddingTop: 20 }}>Learn about Spotify artists</h1>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", paddingBottom: 20 }}>
          <label>
            <select name="selectedArtist" value={selectedArtist} onChange={handleSelectedArtistChange}>
              <option value="">Choose an artist...</option>
              {artistNames.map((artist) => (
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
}

export default App;
