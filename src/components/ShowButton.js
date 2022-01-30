import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from 'axios';

const ShowButton = () => {
    const { user } = useAuth0();

    function peticion (){
        axios.get(`http://127.0.0.1:5000/usuarios/1`, {
    }).then(function (response) {
      console.log(response);
    });
    }


  return <button onClick={() => peticion()}>Peticion</button>;
};

export default ShowButton;