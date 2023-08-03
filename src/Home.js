import React from 'react';
import { Link } from 'react-router-dom';
import './index.css';


const Home = () => {
    return (
        <div className="container">
          <div className="welcome-container">
            <h1 style={{fontSize:'100px'}}>Welcome!!!</h1>
            <h1 style={{marginTop:'-30px'}}>Choose your room</h1>
          </div>
          <div className="door-container">
            <Link to="/upload" className="door">
              Upload
            </Link>
            <Link to="/gallery" className="door">
              Gallery
            </Link>
          </div>
        </div>
      );
            
};

export default Home;
