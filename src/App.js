import React, {useState} from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

function App() {
  const [selectedArtist, setSelectedArtist] = useState("");
  const [monthlyListeners, setMonthlyListeners] = useState("");

  const artists = [
    {
      name: "Maggie Rogers",
      monthlyListeners: 7089646,
      mostStreamedSong: "Dawns (feat. Maggie Rogers)"
    },
    {
      name: "Lorde",
      monthlyListeners: 27123369,
      mostStreamedSong: "Ribs"
    },
    {
      name: "Renee Rapp",
      monthlyListeners: 4996396,
      mostStreamedSong: "I Think I Like You Better When You're Gone"
    },
    {
      name: "Morgan Wallen",
      monthlyListeners: 32830914,
      mostStreamedSong: "I Had Some Help (feat. Morgan Wallen)"
    },
    {
      name: "Bon Iver",
      monthlyListeners: 16094296,
      mostStreamedSong: "exile (feat. Bon Iver)"
    },
    {
      name: "Olivia Dean",
      monthlyListeners: 61943515,
      mostStreamedSong: "Man I Need"
    },
    {
      name: "Anya Gupta",
      monthlyListeners: 3280,
      mostStreamedSong: "you ruined phoebe bridgers"
    },
    {
      name: "Billie Eilish",
      monthlyListeners: 84774525,
      mostStreamedSong: "BIRDS OF A FEATHER"
    },
    {
      name: "Gracie Abrams",
      monthlyListeners: 34874334,
      mostStreamedSong: "That's So True"
    },
    {
      name: "Ethel Cain",
      monthlyListeners: 3442765,
      mostStreamedSong: "Crush"
    },
  ];

  const handleSelectedArtistChange = (e) => {
    setSelectedArtist(e.target.value);
  };

  const handleMonthlyListenerCountClick = () => {
    const findArtist = artists.find(artist => artist.name === selectedArtist);
    console.log("the artist is", findArtist.name);
    if (findArtist) {
      setMonthlyListeners(`monthly listeners`);
    }
  };

  return (
    <div>
      <label>
        <select name="selectedArtist" value={selectedArtist} onChange={handleSelectedArtistChange}>
          <option value="">Choose an artist...</option>
          {artists.map((artist) => (
            <option key={artist.name} value={artist.name}>
              {artist.name}
            </option>
          ))}
        </select>
      </label>
      <Stack spacing={2} direction="row">
        <Button variant="outlined" onClick={() => handleMonthlyListenerCountClick(selectedArtist)}>Get their monthly listener count</Button>
        <Button variant="outlined" onClick={() => {alert("clicked most streamed song")}}>Get their most streamed song</Button>
      </Stack>
      <p>{monthlyListeners}</p>
    </div>
  );
  //return <div>Olivia Dean's most streamed song is {artists.oliviaDean.mostStreamedSong}</div>;
}

export default App;
