import React, { useState } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

function App() {
  const API_BASE_URL = "http://localhost:8080";
  const [selectedArtist, setSelectedArtist] = useState("");
  const [monthlyListeners, setMonthlyListeners] = useState("");
  const [mostStreamedSong, setMostStreamedSong] = useState("");

  // Need to test this new data structure to populate the dropdown - reclone repo and restart the server
  const artists = ["Maggie Rogers", "Lorde", "Renee Rapp", "Morgan Wallen", "Bon Iver", "Olivia Dean", 
    "Anya Gupta", "Billie Eilish", "Gracie Abrams", "Ethel Cain"];

  /* Old format
  const artists = [
    {
      name: "Maggie Rogers",
    },
    {
      name: "Lorde",
    },
    {
      name: "Renee Rapp",
    },
    {
      name: "Morgan Wallen",
    },
    {
      name: "Bon Iver",
    },
    {
      name: "Olivia Dean",
    },
    {
      name: "Anya Gupta",
    },
    {
      name: "Billie Eilish",
    },
    {
      name: "Gracie Abrams",
    },
    {
      name: "Ethel Cain",
    },
  ];*/

  async function getArtist(name) {
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

  const handleSelectedArtistChange = (e) => {
    setSelectedArtist(e.target.value);
  };

  async function handleMonthlyListenerCountClick() {
    const artistData = await getArtist(selectedArtist);
    if (artistData) {
      setMonthlyListeners(`${artistData.name} has ${artistData.monthlyListeners.toLocaleString()} monthly listeners`);
    }
  };

  async function handleMostStreamedSongClick() {
    const artistData = await getArtist(selectedArtist);
    if (artistData) {
      setMostStreamedSong(`${artistData.name}'s most streamed song is "${artistData.mostStreamedSong}"`);
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
