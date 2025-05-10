'use client';

import React from 'react';

const BackgroundOverlay = () => {
  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(56, 30, 15, 0.7)',
        zIndex: 5,
        pointerEvents: 'none',
      }}
    />
  );
};

export default BackgroundOverlay; 