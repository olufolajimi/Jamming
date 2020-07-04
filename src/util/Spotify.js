

const Spotify = {


    redirectURI: "http://localhost:3000/",
    clientID: "756819499fd4455b8ebb596835f33a82",
    
    accessToken: '',
    expirationTime: '',

    getAccessToken() {
        if (this.accessToken) {
            return this.accessToken;
        } else if (window.location.href.match(/access_token=([^&]*)/) &&
        window.location.href.match(/expires_in=([^&]*)/)) {
            this.accessToken = window.location.href.match(/access_token=([^&]*)/)[1]; 
            this.expirationTime = window.location.href.match(/expires_in=([^&]*)/)[1];
            window.setTimeout(() => this.accessToken = '', this.expirationTime * 1000);
            window.history.pushState('Access Token', null, '/');
        } else {
            window.location = `https://accounts.spotify.com/authorize?client_id=${this.clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${this.redirectURI}`;
        } 
    },

    search(term) {
        return fetch(`https://api.spotify.com/v1/search?q=${term}&type=track&limit=5`,
                { headers: {Authorization: `Bearer ${this.accessToken}`} })
            .then( async (response) => { 
                const JSONResponse = await response.json()
                return JSONResponse.tracks.items.map( track => { return {id: track.id, name: track.name, artist: track.artists[0].name, album: track.album.name, uri: track.uri, preview_url: track.preview_url}} )
            })
    },

    savePlaylist(playlistName, trackURIs) {
        if (!playlistName || !trackURIs) {
            return;
        }
        // let headersVar = { Authorization: `Bearer ${this.accessToken}`, "Content-Type": "application/json" };
        // let userID = "";

        fetch("https://api.spotify.com/v1/me",
            {headers: {"Authorization": `Bearer ${this.accessToken}`}} )
            .then( async (response) => {
                let idResponse = await response.json()
                return idResponse.id
            } )
            .then(
                async (userID) => {
                    let response = await fetch(`https://api.spotify.com/v1/users/${userID}/playlists`,
                    { 
                        headers: { Authorization: `Bearer ${this.accessToken}`, "Content-Type": "application/json" }, 
                        method: "POST", 
                        body: JSON.stringify({ name: playlistName })
                    })
                return response
            })
            .then( async (response) => {
                let idResponse = await response.json()
                return idResponse.id
                } )
            .then(
                async (playlistID) => {
                    let response = await fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`, 
                { 
                    headers: { Authorization: `Bearer ${this.accessToken}`, "Content-Type": "application/json" }, 
                    body: JSON.stringify({ uris: trackURIs }),
                     method: "POST" 
                })
                // console.log(response)
                })
            // .then( async (response) => {
            //     let idResponse = await response.json()
            //     // console.log(idResponse)
            //     } )
            
    }
}


export { Spotify };