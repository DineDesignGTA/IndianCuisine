import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { TextField, Button, Typography, Box } from '@mui/material';
import Image from 'next/image';

const ImageUploader = ({ currentImage, onImageChange }) => {
  const [previewImage, setPreviewImage] = useState(currentImage);
  const [googleImageLink, setGoogleImageLink] = useState('');

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
  
      const formData = new FormData();
      formData.append('file', file);
      formData.append('oldImage', currentImage);
  
      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to upload image');
        }
  
        const data = await response.json();
        onImageChange(data.filePath);
      } catch (error) {
        console.error('Error uploading image:', error);
        alert(`Failed to upload image. Error: ${error.message}`);
      }
    }
  }, [currentImage, onImageChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleGoogleImageUpload = async () => {
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ googleImageLink, oldImage: currentImage }),
      });
      const data = await response.json();
      onImageChange(data.filePath);
      setPreviewImage(googleImageLink);
    } catch (error) {
      console.error('Error uploading Google image:', error);
    }
  };

  return (
    <Box>
      <Box
        {...getRootProps()}
        sx={{
          border: '2px dashed #ccc',
          borderRadius: 2,
          padding: 2,
          textAlign: 'center',
          cursor: 'pointer',
          marginBottom: 2,
        }}
      >
        <input {...getInputProps()} />
        {previewImage ? (
          <Image src={previewImage} alt="Current image" width={200} height={200} objectFit="contain" />
        ) : isDragActive ? (
          <Typography>Drop the image here ...</Typography>
        ) : (
          <Typography>Drag 'n' drop an image here, or click to select one</Typography>
        )}
      </Box>
      <Typography variant="subtitle1">Current image: {currentImage}</Typography>
      <TextField
        fullWidth
        variant="outlined"
        label="Google Image Link"
        value={googleImageLink}
        onChange={(e) => setGoogleImageLink(e.target.value)}
        margin="normal"
      />
      <Button variant="contained" onClick={handleGoogleImageUpload} disabled={!googleImageLink}>
        Upload Google Image
      </Button>
    </Box>
  );
};

export default ImageUploader;
