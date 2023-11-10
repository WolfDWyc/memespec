import React, { useState, useRef, useEffect } from 'react';
import SuperGif from 'libgif';

export function RecordableGif({ src, setLoaded }) {

  const [currentFrame, setCurrentFrame] = useState(0);
  const baseGif = useRef(null);

  useEffect(() => {

    if (baseGif.current !== null && baseGif.current.parentNode !== null) {
      console.log('loading gif');
      setCurrentFrame(currentFrame + 1);
      const gif = new SuperGif({ gif: baseGif.current });
      gif.load(() => {
        setLoaded(true);
      });

    }
  }, []);


  return (
    <div>
      <img ref={baseGif} src={src} />
    </div>

  );
}
