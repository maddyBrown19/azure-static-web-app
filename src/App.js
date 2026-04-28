import React, { useState, useEffect } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

function App() {
  const API_BASE_URL = "http://localhost:8080";
  const [artistNames, setArtistNames] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedArtist, setSelectedArtist] = useState("");
  const [artistFollowers, setArtistFollowers] = useState("");
  const [artistMostPopularSong, setArtistMostPopularSong] = useState("");

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

  const handleSelectedArtistChange = (e) => {
    setSelectedArtist(e.target.value);
  };

  async function handleFollowersClick() {
    const followersByArtist = await getFollowersByArtist(selectedArtist)
    if (followersByArtist) {
      setArtistFollowers(`${selectedArtist} has ${parseInt(followersByArtist, 10).toLocaleString()} followers`);
    }
  };

  async function handleArtistMostPopularSongClick() {
    const mostPopularSongByArtist = await getMostPopularSongByArtist(selectedArtist)
    if (mostPopularSongByArtist) {
      setArtistMostPopularSong(`${selectedArtist}'s most popular song in 2025 was "${mostPopularSongByArtist.Song}" with a popularity rating of ${mostPopularSongByArtist.Popularity}/100`);
    }
  }

  async function handleMostStreamedSongClick() {
    //const artistMostStreamedSong = await getSelectedDataByArtist(selectedArtist, "mostStreamedSong", "Artist's most streamed song not found");
    //if (artistMostStreamedSong) {
      //setMostStreamedSong(`${selectedArtist}'s most streamed song is "${artistMostStreamedSong}"`);
    //}
  };

  if (!isLoading) {
    return (
      <span style={{ fontFamily: "Monaco" }}>
        <h1 style={{ textAlign: "center", paddingTop: 20 }}>2025 in Spotify data</h1>
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
            <Button variant="outlined" onClick={() => handleArtistMostPopularSongClick(selectedArtist)}>Most popular song in 2025</Button>
          </Stack>
        </div>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
          <p>{artistFollowers}</p>
          <p>{artistMostPopularSong}</p>
        </div>
      </span>
    );
  }
}

export default App;
