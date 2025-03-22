import React, { useState } from "react";
import {
  Button,
  Dialog,
  Card,
  CardBody,
  CardFooter,
  Typography,
  Textarea,
  Rating,
  Progress,
} from "@material-tailwind/react";
import { DeleteIcon, Edit } from "lucide-react";

const RatingsAndReviews = () => {
  const [rating, setRating] = useState(0);
  const [editRating, setEditRating] = useState(0);
  const [comment, setComment] = useState("");
  const [editComment, setEditComment] = useState("");
  const [reviews, setReviews] = useState([
    {
      id: 1,
      user: { fullName: "Alice" },
      rating: 5,
      comment: "Excellent!",
      date: new Date(),
    },
    {
      id: 2,
      user: { fullName: "Bob" },
      rating: 4,
      comment: "Pretty good!",
      date: new Date(),
    },
    {
      id: 3,
      user: { fullName: "Charlie" },
      rating: 3,
      comment: "It was okay.",
      date: new Date(),
    },
    {
      id: 4,
      user: { fullName: "Dave" },
      rating: 4,
      comment: "Great experience.",
      date: new Date(),
    },
    {
      id: 5,
      user: { fullName: "Eve" },
      rating: 5,
      comment: "Absolutely loved it!",
      date: new Date(),
    },
  ]);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const handleOpen = () => setOpen((cur) => !cur);
  const handleEditOpen = () => setEditOpen((cur) => !cur);

  const formattedDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const ratingStrings = {
    1: "Poor",
    2: "Headache",
    3: "Average",
    4: "Good",
    5: "Excellent!",
  };

  const calculateProgress = (ratingValue) => {
    const totalReviews = reviews.length;
    const count = reviews.filter(
      (review) => review.rating === ratingValue
    ).length;
    return totalReviews ? (count / totalReviews) * 100 : 0;
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const handleAddReview = () => {
    if (rating < 1 || rating > 5) {
      alert("Please Provide a Valid Rating");
      return;
    }
    if (comment.trim() === "") {
      alert("Please Provide a Valid Comment");
      return;
    }
    const newReview = {
      id: Date.now(),
      user: { fullName: "Demo User" },
      rating,
      comment,
      date: new Date(),
    };
    setReviews((prev) => [...prev, newReview]);
    setRating(0);
    setComment("");
    handleOpen();
  };

  const handleDeleteReview = (id) => {
    setReviews((prev) => prev.filter((review) => review.id !== id));
  };

  const handleEditReview = () => {
    if (editRating < 1 || editRating > 5) {
      alert("Please Provide a Valid Rating");
      return;
    }
    if (editComment.trim() === "") {
      alert("Please Provide a Valid Comment");
      return;
    }
    setReviews((prev) =>
      prev.map((review) =>
        review.id === editReview.id
          ? { ...review, rating: editRating, comment: editComment }
          : review
      )
    );
    setEditRating(0);
    setEditComment("");
    handleEditOpen();
  };

  return (
    <>
      <div className="border rounded-md md:w-9/12 mb-10 p-9 font-poppins">
        {reviews.length > 0 ? (
          <>
            <div className="md:w-2/3 border p-2 rounded-md mb-2">
              <div className="flex justify-between">
                <Typography className="text-black text-2xl font-poppins font-medium">
                  Ratings And Reviews
                </Typography>
                <Button
                  onClick={handleOpen}
                  className="bg-white text-black hover:text-white hover:bg-black border me-2"
                >
                  Add Review
                </Button>
              </div>
              <div className="p-10">
                {[5, 4, 3, 2, 1].map((val) => (
                  <div className="p-2 items-center flex gap-4" key={val}>
                    <Progress
                      variant="filled"
                      value={calculateProgress(val)}
                      className="w-full"
                    />
                    <Rating
                      name="read-only"
                      ratedColor="amber"
                      value={val}
                      readonly
                    />
                  </div>
                ))}
                <Typography className="text-lg font-semibold mt-4">
                  Average Rating: {calculateAverageRating()} / 5
                </Typography>
              </div>
            </div>
            <div className="border rounded-md p-6 md:grid grid-cols-2 gap-2 max-h-96 overflow-y-auto">
              {reviews.map((review) => (
                <div
                  className="container grid-cols-1 w-full  p-6 border shadow-xl rounded-md"
                  key={review.id}
                >
                  <div className="w-full flex justify-between">
                    <Typography className="font-semibold text-lg my-2">
                      {review.user.fullName}
                    </Typography>
                    <div className="flex gap-3">
                      <Edit
                        cursor={"pointer"}
                        size={24}
                        onClick={() => {
                          setEditRating(review.rating);
                          setEditComment(review.comment);
                          handleEditOpen();
                        }}
                      />
                      <DeleteIcon
                        cursor={"pointer"}
                        size={24}
                        onClick={() => handleDeleteReview(review.id)}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 mb-2">
                    <div className="flex items-center gap-2 font-bold text-blue-gray-500">
                      {review.rating}
                      <Rating
                        ratedColor="amber"
                        value={review.rating}
                        readonly
                      />
                    </div>
                    {ratingStrings[review.rating] && (
                      <p className="font-poppins font-medium">
                        {ratingStrings[review.rating]}
                      </p>
                    )}
                  </div>
                  <p className="text-gray-500 text-xs ms-2 mb-5">
                    POSTED ON: {formattedDate(review.date)}
                  </p>
                  <p className="text-gray-500 text-base">{review.comment}</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <Typography className="text-black text-2xl font-poppins font-medium">
              Ratings And Reviews
            </Typography>
            <p>No Ratings as of now</p>
            <Button
              onClick={handleOpen}
              className="bg-white text-black hover:text-white hover:bg-black border me-2"
            >
              Add Review
            </Button>
          </>
        )}
      </div>

      {/* Add Review Dialog */}
      <Dialog
        size="xs"
        open={open}
        handler={handleOpen}
        className="bg-transparent shadow-none"
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
      >
        <Card className="mx-auto w-full max-w-[24rem]">
          <CardBody className="flex flex-col gap-4">
            <Typography className="text-black text-2xl font-medium font-poppins">
              Add a Comment
            </Typography>
            <Typography variant="h6">Record Your Rating</Typography>
            <div className="w-full flex justify-center">
              <Rating
                value={rating}
                ratedColor="amber"
                onChange={(value) => setRating(value)}
              />
            </div>
            <Typography variant="h6">Your Comment</Typography>
            <Textarea
              onChange={(e) => setComment(e.target.value)}
              label="Add your comment"
              size="lg"
            />
          </CardBody>
          <CardFooter className="pt-0">
            <button
              className="flex-1 w-full rounded-md p-2 font-semibold text-white bg-sliderBg hover:shadow-xl hover:bg-opacity-90"
              onClick={handleAddReview}
            >
              Submit
            </button>
          </CardFooter>
        </Card>
      </Dialog>

      {/* Edit Review Dialog */}
      <Dialog
        size="xs"
        open={editOpen}
        handler={handleEditOpen}
        className="bg-transparent shadow-none"
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
      >
        <Card className="mx-auto w-full max-w-[24rem]">
          <CardBody className="flex flex-col gap-4">
            <Typography className="text-black text-2xl font-medium font-poppins">
              Edit Your Comment
            </Typography>
            <Typography variant="h6">Update Your Rating</Typography>
            <div className="w-full flex justify-center">
              <Rating
                value={editRating}
                ratedColor="amber"
                onChange={(value) => setEditRating(value)}
              />
            </div>
            <Typography variant="h6">Update Your Comment</Typography>
            <Textarea
              value={editComment}
              onChange={(e) => setEditComment(e.target.value)}
              label="Update your comment"
              size="lg"
            />
          </CardBody>
          <CardFooter className="pt-0">
            <button
              className="flex-1 w-full rounded-md p-2 font-semibold text-white bg-sliderBg hover:shadow-xl hover:bg-opacity-90"
              onClick={handleEditReview}
            >
              Save
            </button>
          </CardFooter>
        </Card>
      </Dialog>
    </>
  );
};

export default RatingsAndReviews;
