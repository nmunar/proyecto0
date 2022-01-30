import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Image from "react-bootstrap/Image";


const Profile = () => {
    const { user, isAuthenticated,isLoading } = useAuth0();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        isAuthenticated && (
            <div style={{ display: "block", padding: 30 }}>
                <p></p>
                <Image src={user.picture} alt={user.name} roundedCircle/>
                <h2>{user.name}</h2>
                <p>Email: {user.email}</p>

            </div>
        )
    );
};

export default Profile;