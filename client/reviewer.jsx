const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');


const handleReview = (e, onSongAdded) => {
    e.preventDefault();
    helper.hideError();

    const title = e.target.querySelector('#songTitle').value;
    const artist = e.target.querySelector('#songArtist').value
    const album = e.target.querySelector('#songAlbum').value;
    const genre = e.target.querySelector('#musicGenre').value

    if(!title || !artist || !genre){
        helper.handleError('All fields are required')
        return false
    }

    helper.sendPost(e.target.action, { title, artist, album, genre}, onSongAdded);
    return false

}

const ReviewForm = (props) => {
    return(
        <form id = "reviewForm"
            onSubmit={(e) => handleReview(e, props.triggerReload)}
            name="reviewForm"
            action="/reviewer"
            method="POST"
            className="reviewForm"
            >
                <label htmlFor="title">Title of Song: </label>
                <input id = "songTitle" type="text" name="title" placeholder="Song Title"></input>
                <label htmlFor="artist">Name of Artist: </label>
                <input id="songArtist" type="text" name="rating" placeholder="Music Artist"></input>
                <label htmlFor="album">Album Song is from: </label>
                <input id="songAlbum" type="text" name="album" placeholder="Song Album"></input>
                <label htmlFor="genre">Music Genre: </label>
                <input id="musicGenre" type="text" name="genre" placeholder="Music Genre"></input>
                <input className="makeReviewSubmit" type="submit" value="Make Review" />
            </form>
    )
}

const MusicList = (props) => {
    const [songs, setSongs] = useState(props.songs)

    useEffect(() => {
        const loadSongsFromServer = async() => {
            const response = await fetch('/getSongs');
            const data = await response.json();
            setSongs(data.songs);
        }
        loadSongsFromServer();
    }, [props.reloadSongs])

    if(songs.length === 0){
        return (
            <div className="musicList">
                <h3 className="emptySong">No Songs Yet!</h3>
            </div>
        )
    }

    const musicNodes = songs.map(song => {
        return (
            <div key={song.title} className="song">
                <img src="/assets/img/spotify.png" alt="spotify icon" className="spotify" />
                <h3 className="songTitle">Song Title: {song.title}</h3>
                <h3 className="songArtist">Song Artist: {song.artist}</h3>
                <h3 className="songAlbum">Song Album: {song.album}</h3>
                <h3 className="musicGenre">Music Genre: {song.genre}</h3>
                <button class="likeButton" type="button">Add To Likes</button>
                <button class="dislikeButton" type="button">Add To Dislikes</button>
            </div>
        )
    });

    return(
        <div className="musicList">
            {musicNodes}
        </div>
    )
}

const App = () => {
    const [reloadSongs, setReloadSongs] = useState(false);

    return (
        <div>
            <div id="makeSong">
                <ReviewForm triggerReload={() => setReloadSongs(!reloadSongs)} />
            </div>
            <div id="songs">
                <MusicList songs={[]} reloadSongs={reloadSongs} />
            </div>
        </div>
    )
}

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render( <App />)
};

window.onload = init;