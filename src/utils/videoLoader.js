/**
 * Video Loader Utility
 * Handles video loading with fallbacks for Git LFS pointers
 * 
 * Usage:
 * import { useVideoLoader } from '../utils/videoLoader';
 * const { videoSrc, error } = useVideoLoader(importedVideo, directPath);
 */

import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook for loading videos with fallback support
 * @param {string} importedPath - The imported video path from utils
 * @param {string} directPath - Direct path fallback (e.g., '/assets/videos/video.mp4')
 * @param {string} fallbackPath - Final fallback path (defaults to working studio video)
 * @returns {object} { videoSrc, error, retry }
 */
export const useVideoLoader = (
  importedPath,
  directPath,
  fallbackPath = '/assets/videos/Final (2).mp4'
) => {
  const [videoSrc, setVideoSrc] = useState(importedPath);
  const [error, setError] = useState(null);
  const retryCountRef = useRef(0);

  const handleError = (e) => {
    const videoError = e.target.error;
    const networkState = e.target.networkState;
    const readyState = e.target.readyState;
    const src = e.target.currentSrc || e.target.src;

    console.error('Video error:', videoError, {
      code: videoError?.code,
      message: videoError?.message,
      readyState,
      networkState,
      src
    });

    setError({
      code: videoError?.code,
      message: videoError?.message,
      src,
      readyState,
      networkState
    });

    // Try direct path fallback
    if (retryCountRef.current === 0 && directPath) {
      console.log(`Video failed, trying direct path: ${directPath}`);
      retryCountRef.current = 1;
      setVideoSrc(directPath);
      return true; // Indicates we're retrying
    }

    // Try final fallback
    if (retryCountRef.current === 1 && fallbackPath) {
      console.log(`Direct path failed, trying fallback: ${fallbackPath}`);
      retryCountRef.current = 2;
      setVideoSrc(fallbackPath);
      return true;
    }

    return false; // No more retries
  };

  const retry = () => {
    retryCountRef.current = 0;
    setVideoSrc(importedPath);
    setError(null);
  };

  return { videoSrc, error, retry, handleError };
};

/**
 * Get direct path for a video file
 * @param {string} filename - Video filename (e.g., 'explore.mp4')
 * @returns {string} Direct path
 */
export const getVideoPath = (filename) => {
  return `/assets/videos/${filename}`;
};

