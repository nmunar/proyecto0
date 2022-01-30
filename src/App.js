import './App.css';
import LoginButton from './components/LoginButton';
import LogoutButton from './components/LogoutButton';
import Profile from './components/Profile';
import EventTable from './components/EventTable';
import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Container, Navbar, Nav } from 'react-bootstrap';

function App() {
  const { user, isAuthenticated } = useAuth0();
  const [id, setId] = useState({});
  const [hayD, setD] = useState(0);

  if (isAuthenticated) {
    if (hayD == 0) {
      axios.post(`http://127.0.0.1:5000/usuarios`, { email: user.email })
        .then(function (response) {
          setId(response['data']['id']);
        })
        .catch(function (error) {
          if (hayD == 0) {
            axios.get(`http://127.0.0.1:5000/usuariosE/${user.email}`)
              .then(function (response) {
                console.log(response['data']['id']);
                setId(response['data']['id']);
                setD(1);
              })
          }

        });
    }

  }

  return (
    <div className="App">
      <Navbar expand="lg" variant="dark" bg="dark">
        <Container>
          <Navbar.Brand >Mi manejador de eventos</Navbar.Brand>

          <Nav placement="end">
            {
              isAuthenticated ?
                (<><LogoutButton /></>) : (<></>)
            }
          </Nav>
        </Container>
      </Navbar>
      {
        isAuthenticated ? (
          <>
            <Profile />
            <EventTable id={id} />

          </>
        ) : (
          <>
            <p></p>
            <LoginButton />
          </>

        )
      }
    </div>
  );
}

export default App;