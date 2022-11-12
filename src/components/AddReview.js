import React, { useState } from 'react';
import ActivDataService from "../services/activs";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import { Rating } from 'react-simple-star-rating'

const AddReview = ({ user }) => {
  const navigate = useNavigate()
  const params = useParams();
  const location = useLocation();

  let editing = false;
  let initialReviewState = "";
  // initialReviewState will have a different value
  // if we're editing an existing review

  const [review, setReview] = useState(initialReviewState);

  const onChangeReview = e => {
    const review = e.target.value;
    setReview(review);
  }

  if (location.state && location.state.currentReview.review) {
    editing = true;
    initialReviewState = location.state.currentReview.review;
  } 

  const saveReview = () => {
    var data = {
      review: review,
      name: user.name,
      user_id: user.googleId,
      activ_id: params.id // get activ id from url
    }

    if (editing) {
      // Handle case where an existing review is being updated 
      data.review_id= location.state.currentReview._id;
      ActivDataService.updateReview(data)
        .then(response => {
          navigate("/activs/"+params.id)
        })
        .catch(e => {
          console.log(e);
        });
    } else {
      ActivDataService.createReview(data)
        .then(response => {
          navigate("/activs/"+params.id)
        })
        .catch(e => {
          console.log(e);
        });
    }
  }

  const [rating, setRating] = useState(0) 

  const handleRating = (rate) => {
    var data = {
      rating: rate, 
      activ_id: params.id
    }
    // console.log(data)
    ActivDataService.updateActivRating(data)
      .then(response => {
        setRating(rate)
      })
      .catch(e=>{
        console.log(e);
      })
  }

  return (
    <Container className="main-container">
        <Form>
          <Form.Group className="mb-3">
            <Form.Label style={{fontFamily: "Dosis", fontSize: "1.5rem", fontWeight: "bold"}}>{ editing ? "Edit" : "Create" } Review</Form.Label>
            <br></br>
            <Rating style={{marginBottom: '1rem'}}
              onClick={handleRating} 
              ratingValue={rating} 
              emptyColor={'white'}
              size={25}
            />
            <Form.Control
              as="textarea"
              type="text"
              required 
              review={ review }
              onChange={ onChangeReview }
              defaultValue={ editing ? location.state.currentReview.review : "" }
            />
          </Form.Group>
            <Button variant="light" onClick={ saveReview }>
              Submit
            </Button>
        </Form>
    </Container>
  )
}

export default AddReview;