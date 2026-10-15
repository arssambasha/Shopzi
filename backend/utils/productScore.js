/* 
Weighted "top rated" score — blends a product's own rating with an
assumed baseline until it has enough reviews to earn its rating, so a
single 5.0-star review can't outrank a 4.5 from thousands of reviews.

BASELINE_RATING: assumed rating for a product with no reviews yet.
MIN_VOTES: how many "phantom" reviews at the baseline get blended in, 
higher = more real reviews needed before a product's own rating dominates.
*/
export const BASELINE_RATING = 3.5;
export const MIN_VOTES = 20;

export const computeProductScore = (rating = 0, numReviews = 0) =>
  (rating * numReviews + BASELINE_RATING * MIN_VOTES) / (numReviews + MIN_VOTES);