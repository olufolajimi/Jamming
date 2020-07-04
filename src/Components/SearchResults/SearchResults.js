import React from 'react';
import './SearchResults.css'
import { Tracklist } from '../Tracklist/Tracklist';

export class SearchResults extends React.Component {
    render() {
        console.log(this.props.searchResults)
        let tracksToDisplay = this.props.searchResults.filter( track => !this.props.playlistTracks.includes(track) )
        return (
            <div className="SearchResults">
                <h2>Results</h2>
                <Tracklist tracks={tracksToDisplay} 
                    playlistTracks={this.props.playlistTracks} 
                    onAdd={this.props.onAdd} 
                    isRemoval={true} />
            </div>
        )
    }
}