import React from 'react';
import { LoadingSpinnerProps } from '../types';

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 40, 
  color = '#3B82F6' 
}) => {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <div 
        className="loader"
        style={{ 
          width: size,
          height: size,
          border: `3px solid ${color}33`,
          borderTop: `3px solid ${color}`,
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          boxShadow: `0 0 10px ${color}`,
        }}
      />
    </div>
  );
};

export default LoadingSpinner;