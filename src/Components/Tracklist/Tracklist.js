import React from 'react';
import { Track } from '../Track/Track';

export class Tracklist extends React.Component {

    render() {
        return (
            <div className="TrackList">
                { this.props.tracks.map(
                    (track) => {
                        return <Track key={track.id} 
                            onAdd={this.props.onAdd} 
                            track={track} 
                            onRemove={this.props.onRemove} 
                            isRemoval={this.props.isRemoval} />
                    } ) 
                }
            </div>
        )
    }
}