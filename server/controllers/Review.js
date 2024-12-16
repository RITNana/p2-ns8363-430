const models = require('../models');

const { Review } = models;

// Render in my review page
const reviewPage = async (req, res) => res.render('reviews');

// make a review, needs all three fields
const makeReview = async (req, res) => {
  if (!req.body.song || !req.body.reviewText || !req.body.rating) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  // append the data for a review document
  const reviewData = {
    song: req.body.song,
    reviewText: req.body.reviewText,
    rating: req.body.rating,
    owner: req.session.account._id,
  };

  try {
    const newReview = new Review(reviewData);
    await newReview.save();
    return res.status(201).json({
      song: newReview.song,
      reviewText: newReview.reviewText,
      rating: newReview.rating,
    });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'review already exists' });
    }
    return res.status(500).json({ error: 'An error occured making domo! ' });
  }
};

// Retrieve the reviews for each user account
const getReviews = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };
    const docs = await Review.find(query).select('song reviewText rating').lean().exec();

    console.log('Fetched reviews: ', docs);
    return res.json({ reviews: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving reviews' });
  }
};

// edit the reviews by id
const editReviews = async (req, res) => {
  const { id } = req.params;
  const { reviewTest, rating } = req.body;

  try {
    const updatedReview = await Review.findByIdAndUpdate(
      { _id: id, owner: req.session.account._id },
      { reviewTest, rating },
      { new: true, runValidators: true },

    );
    if (!updatedReview) { return res.status(404).json({ error: 'Review not found ' }); }

    return res.json(updatedReview);
  } catch (err) {
    return res.status(400).json('Error updating review');
  }
};

// delete the reviews by id
const deleteReviews = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedReview = await Review.findByIdAndDelete(
      {
        _id: id,
        owner: req.session.account._id,
      },
    );
    if (!deletedReview) {
      return res.status(404).json({ error: 'Review not found ' });
    }
    return res.json({ message: 'Review deleted successfully ' });
  } catch (err) {
    return res.status(400).json('Error deleting review');
  }
};

// export functions
module.exports = {
  reviewPage,
  makeReview,
  getReviews,
  editReviews,
  deleteReviews,
};
