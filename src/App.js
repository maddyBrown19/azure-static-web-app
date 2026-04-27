import React, { useState, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

function App() {
  const API_BASE_URL = "http://localhost:8080";
  const [artistNames, setArtistNames] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedArtist, setSelectedArtist] = useState("");
  const [followers, setFollowers] = useState("");
  const [mostStreamedSong, setMostStreamedSong] = useState("");

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

  async function getDataByArtist(name) {
    try {
      const response = await fetch(`${API_BASE_URL}/artistData/${encodeURIComponent(name)}`);
      if (!response.ok) {
        throw new Error("Artist data not found");
      }
      var data = await response.json();
    } catch (error) {
      console.error(error);
    }
    return data;
  }

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

  const handleSelectedArtistChange = (e) => {
    setSelectedArtist(e.target.value);
  };

  async function handleFollowersClick() {
    const followersByArtist = await getFollowersByArtist(selectedArtist)
    //getSelectedDataByArtist(selectedArtist, "monthlyListeners", "Artist's monthly listeners not found");
    if (followersByArtist) {
      setFollowers(`${selectedArtist} has ${followersByArtist.toLocaleString()} followers`);
    }
  };

  async function handleMostStreamedSongClick() {
    //const artistMostStreamedSong = await getSelectedDataByArtist(selectedArtist, "mostStreamedSong", "Artist's most streamed song not found");
    //if (artistMostStreamedSong) {
      //setMostStreamedSong(`${selectedArtist}'s most streamed song is "${artistMostStreamedSong}"`);
    //}
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
            <Button variant="outlined" onClick={() => handleFollowersClick(selectedArtist)}>Number of followers</Button>
            <Button variant="outlined" onClick={() => handleMostStreamedSongClick(selectedArtist)}>Most streamed song</Button>
          </Stack>
        </div>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
          <p>{followers}</p>
          <p>{mostStreamedSong}</p>
        </div>
      </span>
    );
  }
}

export default App;
