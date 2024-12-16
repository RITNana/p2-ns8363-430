// ** ATTEMPTED to create a  Preference Page
// Preference Page would populate the reviews that was created from Main Page
// Preference Page would hold ability to edit and delete reviews
//Page works, but no songs from the MusicList os actually returned


import { MusicList } from "./main.jsx";
const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

const Preferences = () => {
    const [likedSongs, setLikedSongs] = useState([]);
    const [dislikedSongs, setDislikedSongs] = useState([]);

    const handleLikes = (song) => {
        setLikedSongs([...likedSongs, song]);
        console.log("Liked Songs: ", [...likedSongs, song]);
        helper.sendPost('/preferences', song, (result) => {
            console.log('Result from adding to likes: ', result);
        });
    };

    const handleDislikes = (song) => {
        setDislikedSongs([...dislikedSongs, song]);
        console.log("Disliked Songs: ", [...dislikedSongs, song]);
        helper.sendPost("/preferences", song, (result) => {
            console.log('Result from adding to dislikes: ', result);
        });
    };

    // attempted to use the getSong path tp getSongs that were liked and disliked
    useEffect(() => {
        // Fetch liked songs on component mount
        const fetchLikedSongs = async () => {
            try {
                const response = await fetch('/getSongs?status=liked');
                const data = await response.json();
                if (response.ok) {
                    console.log('Liked Songs: ', data.songs);
                    setLikedSongs(data.songs);
                }
            } catch (err) {
                console.log('Error fetching liked songs:', err);
            }
        };

        // Fetch disliked songs on component mount
        const fetchDislikedSongs = async () => {
            try {
                const response = await fetch('/getSongs?status=disliked');
                const data = await response.json();
                if (response.ok) {
                    console.log('Disliked Songs: ', data.songs);
                    setDislikedSongs(data.songs);
                }
            } catch (err) {
                console.log('Error fetching disliked songs:', err);
            }
        };

        fetchLikedSongs();
        fetchDislikedSongs();
    }, []);

    // Return the MusicList, containing the liked and disliked songs
    return (
        <div>
            <h2>Liked Songs</h2>
            <MusicList
                songs={likedSongs} // Pass liked songs
                reloadSongs={() => { }} // No need to reload songs in this context
                addToLikes={handleLikes}
                addToDislikes={handleDislikes} // Provide handlers for adding likes/dislikes
            />

            <h2>Disliked Songs</h2>
            <MusicList
                songs={dislikedSongs} // Pass disliked songs
                reloadSongs={() => { }} // No need to reload songs in this context
                addToLikes={handleLikes}
                addToDislikes={handleDislikes}
            />
        </div>
    );
};

// render in and load our window when option is clicked 
const init = () => {
    const root = createRoot(document.getElementById('preferences'));
    root.render(<Preferences />);
};

window.onload = init;
