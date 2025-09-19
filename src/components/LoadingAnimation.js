'use client'

import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const LoadingAnimation = ({ size = 150, text }) => {
  return (
    <div className="flex flex-col justify-center items-center w-full mx-auto text-center">
      <div style={{ width: size, height: size, margin: '0 auto' }}>
        <DotLottieReact
          src="https://lottie.host/4a17517d-a837-4c5a-b8d8-6071e628a177/YnyEbNL4YN.lottie"
          loop
          autoplay
        />
      </div>
      {text && <span className="text-sm text-gray-600 mt-2 block text-center">{text}</span>}
    </div>
  );
};

export default LoadingAnimation;
