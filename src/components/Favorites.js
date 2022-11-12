import update from 'immutability-helper';
import React, { useState, useEffect, useCallback } from 'react';
import ActivDataService from '../services/activs';
import FavoriteDataService from '../services/favorites';
import DnDCard from "./DnDCard";

import Container from 'react-bootstrap/Container';
import "./Favorites.css";

const Favorites = ({
  user, 
  favorites, 
}) => {
  const [activs, setActivs] = useState([]);
  
  const getActivs = useCallback((ids) => {
    if (ids && ids.length > 0) {
      Promise.all(ids.map(id => ActivDataService.getActivDetail(id)))
        .then(response => {
          setActivs(response.map(res => res.data))
        })
        .catch(e => {
          console.log(e);
          if (e.request) {
            console.log('The activity no longer exist');
          }
        })
    }
  }, [])

  useEffect(() => {
    getActivs(favorites);
  }, [favorites])

  const moveCard = useCallback((dragIndex, hoverIndex) => {
    setActivs((prevCards) => {
      let newDnDCards = update(prevCards, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevCards[dragIndex]],
        ],
      })
      let newFavorites = newDnDCards.map(activ => activ._id);
      let data = {
        _id: user.googleId,
        favorites: newFavorites
      }
      FavoriteDataService.updateFavorites(data)
        .catch(e => {
          console.log(e);
        })

      return newDnDCards;
  })
}, [])

  const renderCard = useCallback((activ, index) => {
    return (
      <DnDCard
        key={activ._id}
        activ={activ}
        index={index}
        moveCard={moveCard}
      />
    )
  }, [moveCard])

  return (
    <div className="App">
      <Container>
        <div className="favoritesPanel">
          {
            favorites && favorites.length > 0 ?
              <span>Drag your favorites to rank them, and click on images to view details</span> 
              :
              <span>You haven't chosen any favorites yet</span>
          }
        </div>
        {
          activs.length > 0 ? (
            <div className="favoritesItems">
              {activs.map((activ, i) => renderCard(activ, i))}
            </div>
          ) : null 
        }
      </Container>
    </div>
  )
}

export default Favorites;
