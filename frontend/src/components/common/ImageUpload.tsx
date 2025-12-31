'use client';

import { useState, useCallback } from 'react';
import { Box, Typography, Button, SxProps, Theme } from '@mui/material';
import { CloudUpload } from '@mui/icons-material';

interface ImageUploadProps {
  label: string;
  previewUrl?: string;
  onFileSelect: (file: File) => void;
  aspectRatio?: number;
  sx?: SxProps<Theme>;
}

export default function ImageUpload({
  label,
  previewUrl = '',
  onFileSelect,
  aspectRatio = 1,
  sx = {},
}: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [localPreview, setLocalPreview] = useState<string>(previewUrl);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const file = e.dataTransfer.files[0];
        handleFile(file);
      }
    },
    [onFileSelect]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      handleFile(file);
    }
  };

  const handleFile = (file: File) => {
    // Check if file is an image
    if (!file.type.match('image.*')) {
      alert('Please select an image file');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setLocalPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Pass file to parent
    onFileSelect(file);
  };

  return (
    <Box
      sx={{
        border: '2px dashed',
        borderColor: dragActive ? 'primary.main' : 'divider',
        borderRadius: 1,
        p: 2,
        textAlign: 'center',
        transition: 'all 0.2s ease-in-out',
        backgroundColor: dragActive ? 'action.hover' : 'background.paper',
        ...sx,
      }}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      {localPreview ? (
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            paddingBottom: `${100 / (aspectRatio || 1)}%`,
            mb: 2,
            overflow: 'hidden',
            borderRadius: 1,
          }}
        >
          <Box
            component="img"
            src={localPreview}
            alt="Preview"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              borderRadius: '50%',
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
              },
            }}
            onClick={() => setLocalPreview('')}
          >
            <Typography color="white" variant="body2">
              ×
            </Typography>
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            py: 4,
          }}
        >
          <CloudUpload fontSize="large" color="action" sx={{ mb: 1 }} />
          <Typography variant="subtitle1" gutterBottom>
            {label}
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            Drag and drop an image here, or click to select
          </Typography>
          <Typography variant="caption" color="textSecondary">
            Recommended size: 800x600px (or similar aspect ratio)
          </Typography>
        </Box>
      )}
      
      <input
        type="file"
        accept="image/*"
        id="image-upload"
        style={{ display: 'none' }}
        onChange={handleChange}
      />
      <label htmlFor="image-upload">
        <Button
          variant="outlined"
          component="span"
          size="small"
          sx={{ mt: 1 }}
        >
          {localPreview ? 'Change Image' : 'Select Image'}
        </Button>
      </label>
    </Box>
  );
}
