import './App.css';
import LoginButton from './components/LoginButton';
import Profile from './components/Profile';
import LogoutButton from './components/LogoutButton';
import EventTable from './components/EventTable';
import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useState } from "react";
import axios from 'axios';

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
      <h1>Event</h1>
      {
        isAuthenticated ? (
          <>
            <Profile />
            <EventTable id={id} />
            <LogoutButton />

          </>
        ) : (
          <LoginButton />
        )
      }
    </div>
  );
}

export default App;