import React, { useState, useEffect, useCallback, useMemo } from 'react';
import ActivDataService from '../services/activs';
import { Link, Navigate, useParams } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import moment from 'moment';
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { BsHeart, BsHeartFill } from "react-icons/bs";
import AliceCarousel from 'react-alice-carousel';
import "react-alice-carousel/lib/alice-carousel.css";
// import { Rating } from 'react-simple-star-rating'
import StarRatings from 'react-star-ratings';

import "react-slideshow-image/dist/styles.css";
import "./Activ.css";

const noImageAvailable = "../images/NoImageAvailable_james-wheeler-ZOA-cqKuJAA-unsplash.jpg";

const API_KEY=process.env.REACT_APP_GOOGLE_API_KEY;

const Activ = ({ 
  user, 
  favorites,
  addFavorite,
  deleteFavorite
}) => {
  
  let rated = false;
  let params = useParams();

  // const [user, setUser] = useState(null);

  const [activ, setActiv] = useState({
    id: null,
    name: "",
    // tags: [],
    tags: "",
    reviews: [],
    images: [],
    coord: [],
  });

  useEffect(() => {
    const getActiv = id => {
      ActivDataService.getActivDetail(id)
        .then(response => {
          setActiv(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    }
    getActiv(params.id);
  }, [params.id]);

  const deleteReview = (reviewId, index) => {
    let data = {
      review_id: reviewId,
      user_id: user.googleId
    };
    ActivDataService.deleteReview(data)
      .then(response => {
        setActiv((prevState) => {
          prevState.reviews.splice(index, 1);
          return ({
            ...prevState
          })
        })
      })
      .catch(e => {
        console.log(e);
      });
  }

  const getCenter = (coord) => {
    // console.log(coord);
    const center = { lat: 42.360, lng: -71.059};
    try {
      center.lat = coord[0];
      center.lng = coord[1];
    } catch (e) {
      console.error(e);
    }
    return center;
  }

  return (
    <div>
      <Container>
        <Row >
          <Col md={12} lg={6}>
            {/* <div className="poster">
              <Image
                className="bigPicture"
                src={activ.images[0]}
                // src={activ.images}
                alt={"images not available"}
                onError={event => {
                  event.target.src = noImageAvailable
                  event.onerror = null
                }}
                fluid />
            </div> */}
            <div>
              { user && (
                  favorites.includes(activ._id) ?
                  <BsHeartFill className="heart2 heartFill" onClick={() => {
                    deleteFavorite(activ._id);
                  }}/>
                  :
                  <BsHeart className="heart2 heartEmpty" onClick={() => {
                    addFavorite(activ._id);
                  }}/>
              ) }
              <AliceCarousel 
              autoPlay={true} 
              autoPlayInterval={5000}
              fadeOutAnimation={true}
              mouseTrackingEnabled={true}
              disableAutoPlayOnAction={true}
              items={activ.images.map((each, index) => (
                  <img 
                    src={each}
                    alt={"images not available"}
                    onError={event => {
                      event.target.src = noImageAvailable
                      event.onerror = null
                    }} />
                ))}
              />
            </div>
          </Col>
          <Col md lg>
            <Card>
              <Card.Header as="h5" style={{fontSize: '1.5em'}}>
                {activ.name}
                <div style={{display: 'flex'}}>
                  <StarRatings
                    rating={
                      activ.rating && activ.rating[1] !== 0 ? (activ.rating[0]/activ.rating[1]) : 0
                    }
                    starDimension="1.5rem"
                    starSpacing=".1rem"
                    starRatedColor="orange"
                  />
                  <Card.Text style={{fontSize: '.75em', paddingTop: '.55em'}}>
                    {'('}
                    {activ.rating ? activ.rating[1] : 0}
                    {')'}
                  </Card.Text>
                </div>
              </Card.Header>
              <Card.Body>
                {/* {user &&
                  <Rating onClick={handleRating} ratingValue={rating} 
                  />
                } */}
                <Card.Text style={{color: "blue"}}>
                  {activ.address}
                </Card.Text>
                <Card.Text>
                  {activ.description}
                </Card.Text>
                <Card.Text className="activTags">
                  {/* Tags: { activ.tags.map((tag, i) => {
                    return (
                      <option value={tag}
                      key={i}>
                        {tag}
                      </option>
                    )
                  })} */}
                  {activ.tags}
                </Card.Text>  
                { user &&
                  <Link to={"/activs/" + params.id + "/review"}>
                    Add Review
                  </Link> }
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row> 
          <Col md={12} lg={6}>
            <Card>
              <Card.Body>
                {/* <div className="map"> */}
                  <LoadScript
                    googleMapsApiKey = {API_KEY}
                  >
                    <GoogleMap
                      mapContainerClassName="map-container"
                      center={getCenter(activ.coord)}
                      zoom={12}
                    >
                      <Marker position={getCenter(activ.coord)}/>
                    </GoogleMap>
                  </LoadScript>
                {/* </div> */}
              </Card.Body>  
            </Card>
          </Col>
          <Col md lg>
            <Card>
              <Card.Header as="h2">Reviews</Card.Header>
              <Card.Body>
                { activ.reviews.map((review, index) => {
                  return (
                    <div className="d-flex" key={review._id}>
                      <div className="flex-shrink-0 reviewsText">
                        <h5>{review.name + " reviewd on "} { moment(review.date).format("Do MMMM YYYY") }</h5>
                        <p className="review">{review.review}</p>
                        { user && user.googleId === review.user_id &&
                          <Row>
                            <Col>
                              <Link to={{
                                pathname: "/activs/"+params.id+"/review"
                              }}
                              state = {{
                                currentReview: review
                              }} >
                                Edit
                              </Link>
                            </Col>
                            <Col>
                              <Button variant="link" onClick={ () =>
                              {
                                deleteReview(review._id, index)
                              } }>
                                Delete
                              </Button>
                            </Col>
                          </Row>
                        }
                      </div>
                    </div>
                  )
                })}     
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Activ;