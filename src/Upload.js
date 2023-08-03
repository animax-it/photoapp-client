import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Upload() {
  const [photo, setPhoto] = useState(null);
  const [detections, setDetections] = useState(null);
  const [status, setStatus] = useState('');
  const [photoError, setPhotoError] = useState('');
  const [detectionsError, setDetectionsError] = useState('');

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
    setPhotoError('');
  };

  const handleDetectionsChange = (e) => {
    setDetections(e.target.files[0]);
    setDetectionsError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!photo) {
      setPhotoError('Please select a photo.');
      return;
    }

    if (!detections) {
      setDetectionsError('Please select a detections file.');
      return;
    }

    if (!photo.name.match(/\.(jpg|jpeg|png|gif)$/)) {
      setPhotoError('Invalid photo format. Supported formats: jpg, jpeg, png, gif');
      return;
    }

    if (!detections.name.match(/\.txt$/)) {
      setDetectionsError('Invalid detections file format. Supported format: txt');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('photo', photo);
      formData.append('detections', detections);

      const response = await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setStatus('Upload successful!');
      } else {
        setStatus('Upload failed. Please try again.');
      }
    } catch (error) {
      setStatus('An error occurred. Please try again.');
    }
  };

  return (
    <div className="upload-container">
      <h1>Upload Photo and Detections</h1>
      <form onSubmit={handleSubmit} className="upload-form">
        <div className="form-row">
          <label className="label" htmlFor="photo">
            Photo:
          </label>
          <div className="input-container">
            <input
              type="file"
              id="photo"
              accept="image/*"
              onChange={handlePhotoChange}
            />
            {photoError && <p className="error-message">{photoError}</p>}
          </div>
        </div>
        <div className="form-row">
          <label className="label" htmlFor="detections">
            Detections File (txt):
          </label>
          <div className="input-container">
            <input
              type="file"
              id="detections"
              accept=".txt"
              onChange={handleDetectionsChange}
            />
            {detectionsError && <p className="error-message">{detectionsError}</p>}
          </div>
        </div>
        <div className="upload-button-container">
          <button type="submit" className="upload-button">
            Upload
          </button>
          <br/><br/>
          <Link to="/gallery">
            <button className="upload-button" style={{width:'200px', height:'50px'}}>Go to Gallery</button>
          </Link>
        </div>
      </form>
      <p className="status">{status}</p>
    </div>
  );
}

export default Upload;
