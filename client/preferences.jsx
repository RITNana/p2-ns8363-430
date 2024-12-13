import { MusicList } from "./main.jsx"
const helper = require('./helper.js')
const React = require('react');
const { useState } = React;
const { createRoot } = require('react-dom/client')

const Preferences = () => {
    const [likedSongs, setLikedSongs] = useState([]);
    const [dislikedSongs, setDislikedSongs] = useState([])


    const handleLikes = (song) => {
        setLikedSongs([...likedSongs, song])
        console.log("Liked Songs: ", [...likedSongs, song])
        helper.sendPost('/preferences', song, (result) => {
            console.log('Result from adding to likes: ', result)
        })
    }

    const handleDislikes = (song) => {
        setDislikedSongs([...dislikedSongs, song])
        console.log("Disliked Songs: ", [...dislikedSongs, song])
        helper.sendPost("/preferences", song, (result) => {
            console.log('Result from adding to dislikes: ', result)
        })
    }
    return (
        <div>
            <h2>Liked Songs</h2>
            <MusicList songs={likedSongs} onSongAdded={handleLikes} />

            <h2>Disliked Songs</h2>
            <MusicList songs={dislikedSongs} onSongAdded={handleDislikes} />
        </div>
    )
}


const init = () => { 
    const root = createRoot(document.getElementById('preferences')); 
    root.render(<Preferences />); 
};

window.onload = init;





