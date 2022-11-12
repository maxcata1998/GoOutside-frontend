import React, { useState, useEffect, useCallback } from 'react';
import ActivDataService from "../services/activs";
import { Link } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import { BsHeart, BsHeartFill } from "react-icons/bs";
import { BsPencil, BsPenFill, BsTrash } from "react-icons/bs";
import { BsPlusLg } from "react-icons/bs";
import { BsStarFill } from 'react-icons/bs';

import "react-slideshow-image/dist/styles.css";
import "./ActivsList.css";

const noImageAvailable = "../images/NoImageAvailable_james-wheeler-ZOA-cqKuJAA-unsplash.jpg";

const MyActivs = ({
  user,
  favorites,
  addFavorite,
  deleteFavorite,
}) => {
  // useState to set state values
  const [activs, setActivs] = useState([]);
 
  const retrieveActivs = useCallback(() => { 
    ActivDataService.getActivsByUser(user.googleId)
      .then(response => {
        setActivs(response.data);        
      })
      .catch(e => {
        console.log(e);
      });
  },[user.googleId]);

  const deleteActiv = useCallback((activ, index) => {
    var data = {
      activ_id: activ._id,
      user_id: user.googleId,                    
      }
    // console.log(data);
    ActivDataService.deleteActivs(data)
      .then(response=>{
        setActivs(response.data.activs);
        console.log(activs);
        console.log("delete success!");
      }) 
      .catch(e=>{
        console.log(e);
      })
  },[activs, user.googleId]);

  useEffect(() => {
    retrieveActivs();
  },[activs, retrieveActivs]);

  return (
    <div className="App">     
      <Container className="main-container">  
        <Link  to={"/myactiv"} style={{ textDecoration:'none'}}>
          <Button variant="light"> 
            <BsPlusLg style={{ marginRight: "10", marginBottom: "3"}}/> 
            Upload new activities 
          </Button>                       
        </Link>  
        <Row className="activRow">
          {/* { activs == null ? alert("You are deleting your activity!") : activs.filter(activ => !activ.hide).map((activ, index) => {     */}
          { activs && activs.filter(activ => !activ.hide).map((activ, index) => {     
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
                    <Card.Title> {activ.name} </Card.Title>
                    <div style={{display: 'flex'}}>
                      <BsStarFill style={{fill: "orange"}}/>    
                      <Card.Text style={{fontSize: '.75em', paddingLeft:'.3em'}}>
                        {activ.rating && activ.rating[1] !==0 ? (activ.rating[0] / activ.rating[1]).toFixed(2): 0}
                        {' '}
                        {'('}
                        {activ.rating ? activ.rating[1] : 0}
                        {')'}
                      </Card.Text>
                    </div>
                    <Card.Text className="activTags">
                      {activ.tags}
                    </Card.Text>  
                    <Card.Text>
                      {activ.address}
                    </Card.Text>
                    <Card.Text className="activDescription">
                      {activ.description}
                    </Card.Text>
                    { user && user.googleId === activ.user_id &&
                      <Row>
                        <Col>                        
                        <Link to={{
                            pathname: "/myactiv"
                          }}
                          state = {{
                            currentActiv: activ
                          }} style={{ textDecoration:'none'}} >
                            <Button variant="secondary" >
                              Edit
                              <BsPencil style={{ marginLeft: "10", marginBottom: "3" }}/>
                            </Button>
                          </Link>  
                        </Col>
                        <Col>
                          <Button variant="danger" onClick = {()=>{
                            let text = `Are you sure you want to delete activity ${activ.name}?`;
                            if (window.confirm(text) == true) {
                              deleteFavorite(activ._id);
                              deleteActiv(activ, index);   
                            } else {
                              console.log('canceled');
                            }                       
                          }}>
                            Delete
                          <BsTrash style={{ marginLeft: "10", marginBottom: "3"}}/>
                          </Button>
                        </Col>
                      </Row>
                    }
                  </Card.Body>  

                </Card>
              </Col>
            )
          })}
        </Row>
        <br />
  
      </Container>
    </div>
  )
}


export default MyActivs;