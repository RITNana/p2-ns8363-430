const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');


const handleMain = (e, setQuery, triggerReload) => {
    e.preventDefault();
    helper.hideError();

    const title = e.target.querySelector('#songTitle').value;
    const artist = e.target.querySelector('#songArtist').value
    const album = e.target.querySelector('#songAlbum').value;
    const genre = e.target.querySelector('#musicGenre').value;


    if (!title && !artist && !album && !genre) {
        helper.handleError('At lease one field is required')
        return false
    }

    setQuery({ title, artist, album, genre });
    triggerReload();
    return false;



}

const HomeForm = (props) => {
    return (
        <form id="homeForm"
            onSubmit={(e) => handleMain(e, props.setQuery, props.triggerReload)}
            name="homeForm"
            action="/main"
            method="POST"
            className="homeForm"
        >

            <label htmlFor="title">Title of Song: </label>
            <input id="songTitle" type="text" name="title" placeholder="Song Title"></input>
            <label htmlFor="artist">Name of Artist: </label>
            <input id="songArtist" type="text" name="rating" placeholder="Music Artist"></input>
            <label htmlFor="album">Album Song is from: </label>
            <input id="songAlbum" type="text" name="album" placeholder="Song Album"></input>
            <label htmlFor="genre">Music Genre: </label>
            <input id="musicGenre" type="text" name="genre" placeholder="Music Genre"></input>
            <input className="makeSongSubmit" type="submit" value="Get Song" />
        </form>
    )

}

const MusicList = (props) => {
    const [songs, setSongs] = useState([])


    useEffect(() => {
        const loadSongsFromServer = async () => {
            try {
                const queryParams = new URLSearchParams(props.query).toString()
                const response = await fetch(`/spotify/search?${queryParams}`);
                if (!response.ok) {
                    console.log("failed to fetch songs")
                }
                const data = await response.json();
                console.log('Data received: ', data)
                setSongs(data.savedTracks || []);
            } catch (err) {
                console.log("failed to fetch songs", err);
                setSongs([]);
            }
        }
        loadSongsFromServer();
    }, [props.query, props.reloadSongs])

    const addToLikes = (song) => {
        console.log("Added to Likes: ", song)
    };

    const addToDislikes = (song) => {
        console.log("Added to Dislikes: ", song);
    }

    if (songs.length === 0) {
        return (
            <div className="musicList">
                <h3 className="emptySong">No Songs Yet!</h3>
            </div>
        )
    }

    const musicNodes = songs.map(song => {
        return (
            <div key={song.spotifyId} className="song">
                <img src="/assets/img/spotify.png" alt="spotify icon" className="spotify" />
                <h3 className="songTitle">Song Title: {song.title}</h3>
                <h3 className="songArtist">Song Artist: {song.artist}</h3>
                <h3 className="songAlbum">Song Album: {song.album}</h3>
                <h3 className="musicGenre">Music Genre: {song.genre}</h3>
                <button onClick={() => addToLikes(song)} className="likeButton" type="button">Add To Likes</button>
                <button onClick={() => addToDislikes(song)} className="dislikeButton" type="button">Add To Dislikes</button>
            </div>
        )
    });

    console.log("Rendered Songs: ", musicNodes)

    return (
        <div className="musicList">
            {musicNodes}
        </div>

    )
};

export { MusicList }






const App = () => {
    const [query, setQuery] = useState({});
    const [reloadSongs, setReloadSongs] = useState(false);



    return (
        <div>
            <div id="makeSong">
                <HomeForm setQuery={setQuery} triggerReload={() => setReloadSongs(!reloadSongs)} />
            </div>
            <div id="songs">
                <MusicList query={query} reloadSongs={reloadSongs} />
            </div>

        </div>
    )
}

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<App />)
};

window.onload = init;