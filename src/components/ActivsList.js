import React, { useState, useEffect, useCallback } from 'react';
import ActivDataService from "../services/activs";
import { Link } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import { BsStar, BsStarFill, BsTextCenter } from "react-icons/bs";
import { BsHeart, BsHeartFill } from "react-icons/bs";
import SimpleImageSlider from "react-simple-image-slider";

import "react-slideshow-image/dist/styles.css";
import "./ActivsList.css";

const images = [
  "https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
  "https://images.unsplash.com/photo-1525721653822-f9975a57cd4c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
  "https://images.unsplash.com/photo-1496545672447-f699b503d270?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2071&q=80",
  "https://images.unsplash.com/photo-1600403477955-2b8c2cfab221?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
  "https://images.unsplash.com/photo-1601226041388-8bbabdd6e37e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
];

const noImageAvailable = "../images/NoImageAvailable_james-wheeler-ZOA-cqKuJAA-unsplash.jpg";

const ActivsList = ({
  user,
  favorites,
  addFavorite,
  deleteFavorite
}) => {
  // useState to set state values
  const [activs, setActivs] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchTag, setSearchTag] = useState("");
  const [tags, setTags] = useState(["All Tags"]);
  const [currentPage, setCurrentPage] = useState(0);
  const [entriesPerPage, setEntriesPerPage] = useState(0);
  const [currentSearchMode, setCurrentSearchMode] = useState("");
  const [windowSize, setWindowSize] = useState(getWindowSize());

  const retrieveTags = useCallback(() => {
    ActivDataService.getTags()
      .then(response => {
        setTags(["All Tags"].concat(response.data))
      })
      .catch(e => {
        console.log(e);
      })
  }, []); // empty array as 2nd arg of useCallback: this func has no dependencies

  const retrieveActivs = useCallback(() => {
    setCurrentSearchMode("");
    ActivDataService.getAll(currentPage)
      .then(response => {
        // console.log(response.data.activs);
        setActivs(response.data.activs);
        setCurrentPage(response.data.page);
        setEntriesPerPage(response.data.entries_per_page);
      })
      .catch(e => {
        console.log(e);
      });
  }, [currentPage]);

  const find = useCallback((query, by) => {
    ActivDataService.find(query, by, currentPage)
      .then(response => {
        console.log(response);
        setActivs(response.data.activs);
      })
      .catch(e => {
        console.log(e);
      });
  }, [currentPage]);

  const findByName = useCallback(() => {
    setCurrentSearchMode("findByName");
    find(searchName, "name");
  }, [find, searchName]);

  const findByTag = useCallback(() => {
    setCurrentSearchMode("findByTag");
    if (searchTag === "All Tags") {
      retrieveActivs();
    } else {
      find(searchTag, "tags");
    }
  }, [find, searchTag, retrieveActivs]);

  const retrieveNextPage = useCallback(() => {
    if (currentSearchMode === "findByName") {
      findByName();
    } else if (currentSearchMode === "findByTag") {
      findByTag();
    } else {
      retrieveActivs();
    }
  }, [currentSearchMode, findByName, findByTag, retrieveActivs]);

  // Use effect to carry out side effect functionality
  useEffect(() => {
    retrieveTags();
  }, [retrieveTags]);

  useEffect(() => {
    setCurrentPage(0);
  }, [currentSearchMode]);

  // Retrieve the next page if currentPage value changes
  useEffect(() => {
    retrieveNextPage();
  }, [currentPage, retrieveNextPage]);

  // Other functions that are not depended on by useEffect
  const onChangeSearchName = e => {
    const searchName = e.target.value;
    setSearchName(searchName);
  }

  const onChangeSearchTag = e => {
    const searchTag = e.target.value;
    setSearchTag(searchTag);
    console.log(searchTag);
  }

  function getWindowSize() {
    const {innerWidth, innerHeight} = window;
    return {innerWidth, innerHeight};
  }

  useEffect(() => {
    function handleWindowResize() {
      setWindowSize(getWindowSize());
    }
    window.addEventListener('resize', handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  return (
    <div className="App">
      <div >
        <SimpleImageSlider className="front-page-slider"
          width={windowSize.innerWidth}
          // height={600}
          height={windowSize.innerWidth * 0.375}
          images={images}
          showBullets={true}
          showNavs={true}
          autoPlay={true}
          autoPlayDelay={6.0}
        />
      </div>
      <Container className="main-container">
        <Form>
          <Row>
            <Col>
              <div className="center-title">
                Explore a Bigger World
              </div>
              <Form.Group className="center-search">
                <Form.Control
                  type="text"
                  placeholder="Search by city, name, or activities"
                  value={searchName}
                  onChange={onChangeSearchName}
                  aria-label="Search"
                  aria-describedby="basic-addon1"
                />
                <Button className="btn-secondary"
                  // variant="dark" 
                  id="button-addon2"
                  onClick={findByName}
                >
                  Search
                </Button>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Group className="mb-3" style={{display: "flex"}}>
                <Form.Control 
                  as="select"
                  onChange={onChangeSearchTag}
                >
                  { tags.map((tag, i) => {
                    return (
                      <option value={tag}
                      key={i}>
                        {tag}
                      </option>
                    )
                  })}
                </Form.Control>
                <Button className="btn-secondary"
                  // variant="dark" 
                  id="button-addon2"
                  onClick={findByTag}
                >
                  Search
                </Button>
              </Form.Group>
            </Col>
          </Row>    
        </Form>
        <Row className="activRow">
          { activs.filter(activ => !activ.hide).map((activ) => {
          // { activs.map((activ) => {
            return (
              <Col key={activ._id}>
                <Card className="activsListCard">
                  { user && (
                      favorites.includes(activ._id) ?
                      <BsHeartFill className="heart heartFill" onClick={() => {
                        deleteFavorite(activ._id);
                      }}/>
                      :
                      <BsHeart className="heart heartEmpty" onClick={() => {
                        addFavorite(activ._id);
                      }}/>
                  ) }
                  <div className="cardImage">
                    <Link to={"/activs/"+activ._id}>
                      <Card.Img 
                        className="smallPoster" 
                        src={activ.images[0]}
                        alt={"poster not available"}
                        onError={event => {
                          event.target.src = noImageAvailable
                          event.onerror = null
                        }}
                        />
                    </Link>
                  </div>
                  
                  <Card.Body className="activCardBody">
                    <Card.Title> {activ.name}</Card.Title>
                    <div style={{display: 'flex'}}>
                      <BsStarFill style={{fill: "orange"}}/>    
                      <Card.Text style={{fontSize: '.75em', paddingLeft:'.3em'}}>
                        {activ.rating && activ.rating[1] !==0 ? (activ.rating[0]/ activ.rating[1]).toFixed(2): 0}
                        {' '}
                        {'('}
                        {activ.rating ? activ.rating[1] : 0}
                        {')'}
                      </Card.Text>
                    </div>
                      
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
                    <Card.Text>
                      {/* {activ.address[1]} */}
                      {activ.address}
                    </Card.Text>
                    <Card.Text className="activDescription">
                      {activ.description}
                    </Card.Text>
                  </Card.Body>  
                </Card>
              </Col>
            )
          })}
        </Row>
        <br />
        Showing page: { currentPage + 1 }.
        <Button
          variant="link"
          onClick={() => { setCurrentPage(currentPage + 1)} }
        >
          Get next { entriesPerPage } results
        </Button>
      </Container>
    </div>
  )
}

export default ActivsList;