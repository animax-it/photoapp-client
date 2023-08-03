import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ImageTable from './ImageTable';
import './index.css';

const images = require.context('../../server/uploads/', true);

function Gallery() {
  const [imageDetails, setImageDetails] = useState([]);
  const [imageList, setImageList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentImage, setCurrentImage] = useState('');
  const [showPopup, setShowPopup] = useState(false); 
  const [sortOption, setSortOption] = useState('oldest');


  const popupRef = useRef(null); 

  useEffect(() => {
    axios.get('http://localhost:5000/images') 
      .then(response => {
        setImageList(response.data);
      })
      .catch(error => {
        console.error('Error fetching image list:', error);
      });
  }, []);

  const fetchImageDetails = (filename) => {
    setCurrentImage(filename);
    setLoading(true);
    axios.get('http://localhost:5000/image/detail', {
      params: {
        fileName: filename,
      }
    })
      .then(response => {
        setImageDetails(response.data);
        setLoading(false);
        setShowPopup(true); // Open the popup after loading details
      })
      .catch(error => {
        console.error('Error fetching image details:', error);
        setLoading(false);
      });
  };

  const closePopup = () => {
    setShowPopup(false);
    setImageDetails([]); 
  };

  const handleOutsideClick = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      closePopup();
    }
  };

  const handleSortChange = (option) => {
    setSortOption(option);
    const sortedImageList = [...imageList];
    if (option === 'newest') {
      sortedImageList.sort((a, b) => b.localeCompare(a));
    } else if (option === 'oldest') {
      sortedImageList.sort((a, b) => a.localeCompare(b));
    }
    setImageList(sortedImageList);
  };
  
  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  return (
    <div className="image-gallery-container">
     <div>
      <h1>Image Gallery</h1>

      <div className="sort-dropdown">
        <label htmlFor="sort">Sort by: </label>
        <select
          id="sort"
          value={sortOption}
          onChange={(e) => handleSortChange(e.target.value)}
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
      </div>

      <div className="image-gallery">
        {imageList.map((filename, index) => (
          <div key={filename} className="image-card" onClick={() => fetchImageDetails(filename.replace('.jpg', ''))}>
            <img src={images(`./${filename}`)} alt={filename} />
            <p>{filename}</p>
          </div>
        ))}
      </div>
    </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content" ref={popupRef}>
            <button className="close-button" onClick={closePopup}>Close</button>
            <div className="image-table-container">
              {imageDetails.length > 0 && (
                <ImageTable products={imageDetails} currentImage={currentImage} />
              )}
            </div>
          </div>
        </div>
      )}

    
    </div>
  );
}

export default Gallery;
