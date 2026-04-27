import React from "react";

const ReviewUI = ({
  product,
  rating,
  setRating,
  comment,
  setComment,
  loading,
  submitReview,
  removeReview,
  existingReview,
  user,
  ratingStats,
}) => {
  return (
    <div className="mt-16">
      {/* TOP SECTION */}
      <div className="grid md:grid-cols-2 gap-10">
        {/* LEFT: SUMMARY*/}
        <div>
          <h2 className="text-xl font-semibold">Customer Reviews</h2>

          {/* Average */}
          <div className="flex items-center gap-3 mt-2">
            <span className="text-3xl font-bold">
              {product.rating?.toFixed(1)}
            </span>

            <span className="text-yellow-500 text-lg">
              {"★".repeat(Math.round(product.rating || 0))}
              {"☆".repeat(5 - Math.round(product.rating || 0))}
            </span>
          </div>

          <p className="text-sm text-gray-500 mt-1">
            {product.numReviews} global ratings
          </p>

          {/* Breakdown */}
          <div className="mt-4 space-y-2">
            {[5, 4, 3, 2, 1].map((star, i) => {
              const count = ratingStats[i] || 0;
              const percent =
                product.numReviews > 0 ? (count / product.numReviews) * 100 : 0;

              return (
                <div key={star} className="flex items-center gap-3">
                  <span className="text-sm w-10">{star}★</span>

                  <div className="flex-1 h-2 bg-gray-200 rounded">
                    <div
                      className="h-2 bg-yellow-400 rounded"
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <span className="text-xs text-gray-500">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/*RIGHT: REVIEW FORM */}
        <div>
          <h3 className="font-medium mb-3">
            {existingReview ? "Update your review" : "Write a review"}
          </h3>

          {!user ? (
            <p className="text-gray-400 text-sm">
              Please login to write a review
            </p>
          ) : (
            <>
              {/* Stars */}
              <div className="flex gap-2 mb-3">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    onClick={() => setRating(s)}
                    className={`text-2xl ${
                      s <= rating ? "text-yellow-500" : "text-gray-300"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>

              {/* Comment */}
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts..."
                className="w-full border p-3 rounded mb-3 text-sm"
              />

              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={submitReview}
                  disabled={loading}
                  className="bg-black text-white px-5 py-2 rounded"
                >
                  {loading
                    ? "Saving..."
                    : existingReview
                      ? "Update Review"
                      : "Submit Review"}
                </button>

                {existingReview && (
                  <button
                    onClick={removeReview}
                    className="border text-red-500 px-4 py-2 rounded"
                  >
                    Delete
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/*REVIEW LIST */}
      <div className="mt-10 space-y-6">
        {product.reviews?.map((rev, i) => (
          <div key={i} className="border-b pb-4">
            {/* Header */}
            <div className="flex justify-between items-center">
              <p className="font-medium">{rev.name}</p>

              <p className="text-xs text-gray-400">
                {new Date(rev.createdAt).toLocaleDateString()}
              </p>
            </div>

            {/* Stars */}
            <p className="text-yellow-500 text-sm mt-1">
              {"★".repeat(rev.rating)}
              {"☆".repeat(5 - rev.rating)}
            </p>

            {/* Verified */}
            <p className="text-xs text-green-600 mt-1">✔ Verified Purchase</p>

            {/* Comment */}
            <p className="text-gray-700 mt-2 text-sm">{rev.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewUI;
