import React from 'react';
import './App.css';
import { SearchResults } from '../SearchResults/SearchResults';
import { Playlist } from '../Playlist/Playlist';
import { SearchBar } from '../SearchBar/SearchBar';
import { Spotify } from '../../util/Spotify';

/*
TO DEPLOY:
1 - INSTALL SURGE GLOBALLY: npm install --global surge
2 - RUN domain_name.surge.sh, set redirectURI in Spotify.js and Spotify API dashboard to domain_name
3 - RUN npm run build
4 - cd INTO build AND RUN surge
 */


class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = { 
      searchResults: [],
      playlistName: "PlaysHolder",
      playlistTracks: []
    }
    this.addTrack = this.addTrack.bind(this)
    this.removeTrack = this.removeTrack.bind(this)
    this.updatePlaylistName = this.updatePlaylistName.bind(this)
    this.savePlaylist = this.savePlaylist.bind(this)
    this.search = this.search.bind(this)
  }

  componentDidMount() {
    Spotify.getAccessToken();
    console.log(Spotify.accessToken)
  }

  addTrack(track) {
    if (this.state.playlistTracks.find( savedTrack => savedTrack.id === track.id )) {
      return
    }
    this.state.playlistTracks.push(track)
    this.setState({ playlistTracks: this.state.playlistTracks })
  }

  removeTrack(track) {
    console.log("Removing " + `${track.name}`)
    let newPlaylistTracks = this.state.playlistTracks.filter( savedTrack => savedTrack.id !== track.id )
    this.setState({ playlistTracks: newPlaylistTracks })
  }

  updatePlaylistName(name) {
    this.setState({ playlistName: name })
  }

  savePlaylist() {
    const trackURIs = this.state.playlistTracks.map((track) => { return track.uri } )
    Spotify.savePlaylist(this.state.playlistName, trackURIs)
    this.setState({playlistName: "New Playlist", playlistTracks: []})
    return
  }

  async search(term) {
    const results = await Spotify.search(term)
    this.setState({ searchResults: results }) 
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} 
              onAdd={this.addTrack} 
              playlistTracks={this.state.playlistTracks} />
            <Playlist playlistName={this.state.playlistName} 
              playlistTracks={this.state.playlistTracks} 
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
