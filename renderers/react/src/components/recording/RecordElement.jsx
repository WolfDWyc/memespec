import React, { useState, useRef, useEffect } from 'react';
import RecordRTC, { invokeSaveAsDialog, RecordRTCPromisesHandler } from 'recordrtc';
import html2canvas from 'html2canvas';


function RecordElement({elementRef, recording, setBlob }) {
  const canvasRef = useRef(null);
  const playbackRef = useRef(null);
  const recorderRef = useRef(null);
  const animationRef = useRef(null);

  const handleRecording = async () => {
    recorderRef.current = new RecordRTCPromisesHandler(canvasRef.current, { type: 'canvas', mimeType: 'video/mp4' });
    recorderRef.current.startRecording();
    animationRef.current = requestAnimationFrame(renderFrame);

    return () => cancelAnimationFrame(animationRef.current);
  };

  useEffect(() => {
    if (recording) {
        handleRecording();
    } else if (recorderRef.current !== null) {
        handleStop();
    }
    }, [recording]);

  const renderFrame = () => {
    html2canvas(elementRef.current, { useCORS: true }).then(function (canvas) {
      if (canvasRef.current === null) {
        return;
      }

      canvasRef.current.width = elementRef.current.offsetWidth;
      canvasRef.current.height = elementRef.current.offsetHeight;

      canvasRef.current.getContext('2d',).clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      canvasRef.current.getContext('2d').drawImage(canvas, 0, 0, canvasRef.current.width, canvasRef.current.height);

      animationRef.current = requestAnimationFrame(renderFrame);
    });
  }

  useEffect(() => {
    return
  }, []);

  const handleStop = async () => {
    await recorderRef.current.stopRecording();
    setBlob(await recorderRef.current.getBlob());
  };


  return (
    <div>
      {recording && <canvas ref={canvasRef} style={{ display: 'none' }} />}
    </div>
  );
}

export default RecordElement;