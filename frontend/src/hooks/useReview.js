import { useState, useEffect, useMemo } from "react";
import { addReview, updateReview, deleteReview } from "../api/productApi";
import { errorToast, successToast } from "../Toast";

export const useReview = (product, user, refresh) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  // DETECT USER REVIEW
  const existingReview = useMemo(() => {
    if (!product || !user) return null;

    return product.reviews?.find(
      (r) => r.user?.toString() === user._id?.toString(),
    );
  }, [product, user]);

  // PREFILL
  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.rating);
      setComment(existingReview.comment);
    } else {
      setRating(0);
      setComment("");
    }
  }, [existingReview]);

  // ADD / UPDATE
  const submitReview = async () => {
    if (!user) return errorToast("Please login first");
    if (!rating) return errorToast("Select rating");

    try {
      setLoading(true);

      let res;

      if (existingReview) {
        res = await updateReview(product._id, {
          rating,
          comment,
        });
      } else {
        res = await addReview(product._id, {
          rating,
          comment,
        });
      }

      if (res.success) {
        successToast(existingReview ? "Review updated" : "Review added");

        setRating(0);
        setComment("");

        refresh(); //  refetch product
      } else {
        errorToast(res.message);
      }
    } catch (err) {
      const message =
        err?.response?.data?.message || err.message || "Something went wrong";

      errorToast(message);
    } finally {
      setLoading(false);
    }
  };

  // DELETE
  const removeReview = async () => {
    if (!existingReview) return;

    try {
      setLoading(true);

      const res = await deleteReview(product._id);

      if (res.success) {
        successToast("Review deleted");

        setRating(0);
        setComment("");

        refresh();
      } else {
        errorToast(res.message);
      }
    } catch (err) {
      const message =
        err?.response?.data?.message || err.message || "Something went wrong";

      errorToast(message);
    } finally {
      setLoading(false);
    }
  };

  // RATING BREAKDOWN
  const ratingStats = useMemo(() => {
    if (!product?.reviews) return [0, 0, 0, 0, 0];

    const counts = [0, 0, 0, 0, 0];

    product.reviews.forEach((r) => {
      counts[r.rating - 1]++;
    });

    return counts.reverse(); // 5★ → 1★
  }, [product]);

  return {
    // state
    rating,
    setRating,
    comment,
    setComment,
    loading,

    // logic
    submitReview,
    removeReview,

    // helpers
    existingReview,
    ratingStats,
  };
};
