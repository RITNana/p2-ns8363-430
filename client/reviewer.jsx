// **ATTEMPTED to create a Reviews Page for seeing song reviews

const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

// No reloads when submitting a new review
const ReviewForm = (props) => {
    const handleReview = (e) => {
        e.preventDefault();
        props.triggerReload();
        props.closeForm();
    }
    // The Review Form
    return (
        <form id="reviewForm"
            className="reviewPopup"
            name="reviewForm"
            onSubmit={handleReview}
            action="/reviews"
            method="POST">
            <div className="popup-inner"></div>
            <br /> <br />
            <label htmlFor="song">Song: </label>
            <input id="songName" type="text" name="song" placeholder="Song Name"></input>
            <br /><br />
            <label htmlFor="reviewText">Review: </label>
            <input id="songReview" type="text" name="reviewText" placeholder="Song Review"></input>
            <br /><br />
            <label htmlFor="rating">Rating of Song: </label>
            <input id="songRating" type="number" name="rating" placeholder="Song Rating"></input>
            <br /><br />
            <input type="submit" className="submitBtn" value="Create Review"></input>
        </form>
    )
}

// export reviewForm so it may be used in main.jsx as a popup window
export default ReviewForm

const ReviewList = (props) => {
    const [reviews, setReviews] = useState([props.reviews]);

    useEffect(() => {
        const loadReviewsFromServer = async () => {
            try {
                const response = await fetch('/getReviews');
                const data = await response.json();
                console.log('Fetched reviews from server: ', data.reviews)
                setReviews(data.reviews)
            } catch (err) {
                console.err('Error fetching reviews', err);
            }
        }
        loadReviewsFromServer();
    }, [props.reloadReviews])

    // handling edits for written reviews, attempted to use PUT HTTP Command
    const handleReviewEdits = async (id, reviewText, rating) => {
        try {
            const response = await fetch(`/editReview/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id, reviewText, rating })
            })
            const result = await response.json();
            setReviews(reviews.map((review) => review._id === id ? result : review))
        } catch (err) {
            console.log("error editing review ", err)
        }
    };

    // handling deletes for written reviews, attempted to use PUT HTTP Command
    const handleDeleteEdits = async (id) => {
        try {
            const response = await fetch(`/deleteReview/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const result = await response.json();
            console.log("Deleted Result: ", result)
            setReviews(reviews.filter((review) => review._id !== id))
        } catch (err) {
            console.log("Error deleting review ", err)
        }
    }

    // if no reviews, make sure it is known
    if (reviews.length === 0) {
        return (
            <div className="reviewList">
                <h3 className="emptyReview">No Reviews Yet!</h3>
            </div>
        );
    }

    // the format for every single review node
    const reviewNodes = reviews.map((review) => {
        return (
            <div key={review._id} className="review">
                <h3 className="songName">Song Name: {review.song}</h3>
                <h3 className="songReview">Song Review: {review.reviewText}</h3>
                <h3 className="songRating">Song Rating: {review.rating}</h3>
                <button type="button" className="editBtn" onClick={() => handleReviewEdits(review._id, review.reviewText, review.rating)}>Edit Review</button>
                <button type="button" className="deleteBtn" onClick={() => handleDeleteEdits(review._id)}>Delete Review</button>
            </div>
        )
    })

    return (
        <div className="reviewList">
            {reviewNodes}
        </div>
    )

}

// set the state for reviews and when clicked to make a review, populate review
// populate all reviews too
const Review = () => {
    const [reloadReviews, setReloadReviews] = useState(false)

    return (
        <div>
            <div id="makeReview">
                <ReviewForm triggerReload={() => setReloadReviews(!reloadReviews)} />
            </div>
            <div id="reviews">
                <ReviewList reviews={[]} reloadReviews={reloadReviews} />
            </div>
        </div>
    )
}

const init = () => {
    const root = createRoot(document.getElementById('reviews'))
    root.render(<Review />)
}

window.onload = init;