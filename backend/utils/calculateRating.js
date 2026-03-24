// Auto update rating when reviews change
const calculateRating = function (product) {
  product.numReviews = product.reviews.length;

  product.rating =
    product.reviews.length === 0
      ? 0
      : product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;
};

export default calculateRating;
