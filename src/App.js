import { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Link } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
import "bootstrap/dist/css/bootstrap.min.css";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Login from "./components/Login";
import Logout from "./components/Logout";
import AddReview from "./components/AddReview";

import AddActiv from './components/AddActiv';
import ActivsList from "./components/ActivsList";
import Activ from "./components/Activ";
import Favorites from "./components/Favorites";
import MyActivs from './components/MyActivs';
import FavoriteDataService from "./services/favorites";

import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend';

import "./App.css";
import { NavItem } from 'react-bootstrap';

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

function App() {

  const [user, setUser] = useState(null);
  // console.log(user);
  const [favorites, setFavorites] = useState([]);

  const addFavorite = (activId) => {
    setFavorites([...favorites, activId])
  }

  const deleteFavorite = (activId) => {
    setFavorites(favorites.filter(f => f !== activId));
  }

  const getFavorite = useCallback((userId) => {
    FavoriteDataService.getFavoritesById(userId)
      .then(response => {
        // console.log(response);
        setFavorites(response.data.favorites)
      })
      .catch(e => {
        console.log(`Get favorite failed: ${e}`);
      })
  }, []);

  const updateFavorite = useCallback((userId, favorites) => {
    // console.log(favorites);
    let data = {
      _id: userId,
      favorites: favorites
    }
    FavoriteDataService.updateFavorites(data)
      .catch(e => {
        console.log(`update favorite failed: ${e}`);
      })
  }, []);

  useEffect(() => {
    if (user) {
      getFavorite(user.googleId);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      updateFavorite(user.googleId, favorites);
    }
  }, [favorites]);

  useEffect(() => {
    let loginData = JSON.parse(localStorage.getItem("login"));
    if (loginData) {
      let loginExp = loginData.exp;
      let now = Date.now() / 1000;
      if (now < loginExp) {
        // Not expired
        setUser(loginData);
      } else {
        // Expired
        localStorage.setItem("login", null);
      }
    }
  }, []);

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="App">
        <Navbar bg="dark" expand="lg" sticky="top" variant="dark">
          <Container className="container-fluid">
            <Navbar.Brand className="brand" href="/">
              <img src="/images/gooutside-logo.jpg" alt="GoOutside logo" className="goOutsideLogo" />
              Go<span>Outside</span>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav" >
              <Nav className="ml-auto">
                <Nav.Link as={Link} to={"/activs"}>
                  Activities
                </Nav.Link>
                {user ? (
                  <ul>
                    <Nav.Link as={Link} to={"/favorites"}>
                      Favorites
                    </Nav.Link>
                    {/* <Nav.Link as={Link} to={"/myactiv"}>
                      Add/Edit
                    </Nav.Link> */}
                    <Nav.Link as={Link} to={"/user"}>
                      My Activities
                    </Nav.Link>
                  </ul>
                ) : null}
              </Nav>
            </Navbar.Collapse>
            {user ? (
              <Logout setUser={setUser} />
            ) : (
              <Login setUser={setUser} />
            )}
          </Container>
        </Navbar>
        <Routes>
          <Route exact path={"/"} element={
            <ActivsList
              user={user}
              addFavorite={addFavorite}
              deleteFavorite={deleteFavorite}
              favorites={favorites}
            />}
          />
          <Route exact path={"/activs"} element={
            <ActivsList
              user={user}
              addFavorite={addFavorite}
              deleteFavorite={deleteFavorite}
              favorites={favorites}
            />}
          />
          <Route path={"/activs/:id/"} element={
            // <Activ user={user} />}
            <Activ 
              user={user}
              addFavorite={addFavorite}
              deleteFavorite={deleteFavorite}
              favorites={favorites}
            />}
          />
          <Route path={"/myactiv"} element={
            <AddActiv user={user} />}
          />
          <Route path={"/user"} element={
            user ?
            <MyActivs user={user}
            addFavorite={addFavorite}
            deleteFavorite={deleteFavorite}
            favorites={favorites} />
            :
            <ActivsList
              user={user}
              addFavorite={addFavorite}
              deleteFavorite={deleteFavorite}
              favorites={favorites}
            />}
          />
          <Route path={"/activs/:id/review"} element={
            <AddReview user={user} />}
          />
          <Route path={"/favorites"} element={
            user ?
              <DndProvider backend={HTML5Backend}>
                <Favorites
                  user={user}
                  favorites={favorites}
                />
              </DndProvider>
              :
              <ActivsList
                user={user}
                addFavorite={addFavorite}
                deleteFavorite={deleteFavorite}
                favorites={favorites}
              />}
          />
        </Routes>
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;
