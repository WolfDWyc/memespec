import React, { useState, useRef, useEffect } from 'react';
import '../App.css';
import RecordRTC, { invokeSaveAsDialog, RecordRTCPromisesHandler } from 'recordrtc';
import html2canvas from 'html2canvas';
import { RecordableGif } from './recording/RecordableGif';
import RecordElement from './recording/RecordElement';

import { FFmpeg, createFFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL, fetchFile } from "@ffmpeg/util";
import JSONEditorReact from './json/JsonEditor';
import LiveEditor from './live_editor/LiveEditor';


function MemePart1({ blob, setBlob }) {
  const elementRef = useRef(null);
  const [recording, setRecording] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setRecording(false);
    }, 3000);
  }, []);

  return (<div>
    <div ref={elementRef} style={{ marginBottom: '10px', fontSize: '10px' }} >
      <h1>People that use regular meme generators</h1>
      <img src={"https://thumbs.dreamstime.com/b/scratched-dumb-framed-rounded-rectangle-stamp-dumb-stamp-seal-print-distress-style-seal-shape-rounded-rectangle-131955849.jpg"} />
    </div>
    <RecordElement elementRef={elementRef} recording={recording} setBlob={setBlob} />
  </div>);
}

function MemePart2({ blob, setBlob }) {
  const elementRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setRecording(false);
    }, 7000);
  }, []);


  useEffect(() => {
    if (loaded) {
      setRecording(true);
    }
  }, [loaded]);

  return (<div>
    <div ref={elementRef} style={{ marginBottom: '10px', fontSize: '10px' }} >
      <h1>People that record their memes using react-memespec</h1>
      <RecordableGif src={"https://media.tenor.com/yPUAJMwL2uwAAAAC/gigachad.gif"} setLoaded={setLoaded} />
    </div>
    <RecordElement elementRef={elementRef} recording={recording} setBlob={setBlob} />
  </div>);

}

function App() {
  const [blobs, setBlobs] = useState([]);
  const [part1Done, setPart1Done] = useState(false);


  const setBlob = (blob) => {
    if (blob !== null) {
      console.log("blob set");
      setBlobs([...blobs, blob]);
      setPart1Done(true);
    }
  }

  useEffect(() => {
    async function saveMeme() {
      if (blobs.length === 2) {
        console.log("done");
        const ffmpeg = createFFmpeg({
          corePath:
            "https://gw.alipayobjects.com/os/lib/ffmpeg/core/0.10.0/dist/ffmpeg-core.js",
          log: true
        });

        await ffmpeg.load();

        for (let i = 0; i < blobs.length; i++) {
          ffmpeg.writeFile(`test${i}.mp4`, blobs[i]);
        }

        await ffmpeg.run('-i', 'concat:test0.mp4|test1.mp4', '-c', 'copy', 'output.mp4');
        const data = ffmpeg.readFile('output.mp4');
        const video = document.createElement('video');
        video.src = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
        video.controls = true;
        document.body.appendChild(video);


      }
    }
    saveMeme();
  }, [blobs]);


  return (
    <div style={{width: '100vw', height: '100vh'}}>
      {/* {part1Done ? <div>
        <MemePart2 setBlob={setBlob}  />
      </div> : <div>
        <MemePart1 setBlob={setBlob}  />
      </div>} */}
          <LiveEditor />

    </div >
  );
}

export default App;