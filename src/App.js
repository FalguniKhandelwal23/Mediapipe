import React from "react";

//import ClassComponent from "./components/ClassComponent";
//import FunctionComponent from "./components/FunctionComponent";
import { createHandLandmarker } from "./handlandmarker";
import { DrawingUtils, HandLandmarker } from "@mediapipe/tasks-vision";

function App() {
  const canvasRef = React.useRef(null);
  const contextRef = React.useRef(null);
  const inputVideoRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const videoRef = inputVideoRef.current;

    if (canvas) {
      contextRef.current = canvas.getContext("2d");
    }

    if (contextRef.current && canvas && videoRef) {
      createHandLandmarker().then((handLandmarker) => {
        const drawingUtils=new DrawingUtils(contextRef.current);
        let lastVideoTime=-1;
        let results=undefined;
        function predict(){
          canvas.style.width=videoRef.videoWidth;
          canvas.style.height=videoRef.videoHeight;
          canvas.width=videoRef.videoWidth;
          canvas.height=videoRef.videoHeight;
          let startTimeMs = performance.now();
            if(lastVideoTime!==videoRef.currentTime)
            {
              lastVideoTime=videoRef.currentTime;
              results = handLandmarker.detectForVideo(videoRef, startTimeMs);
              console.log(results);
            
}
contextRef.current.save();
contextRef.current.clearRect(0,0,canvas.width,canvas.height);
if(results.landmarks){
  for(const landmarks of results.landmarks){

    drawingUtils.drawConnectors(
      landmarks,
      HandLandmarker.HAND_CONNECTIONS,
      {
        color:"#00ff00",
        lineWidth:5,
      }
    )
    drawingUtils.drawLandmarks(landmarks,{
      color:"#ff0000",
      lineWidth:2,
    })

  }
}
      window.requestAnimationFrame(predict);
        }
        navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
          videoRef.srcObject = stream;
          videoRef.addEventListener('loadeddata',predict)
        });
        // Use the handLandmarker instance here
      });
    }

    // Add the necessary logic here for other setup

    return () => {
      // Clean up any resources or event listeners if needed
    };
  }, []);

  return (
    <div style={{ position: "relative" }}>
      <video
        id="webcam"
        style={{ position: "absolute" }}
        autoPlay
        playsInline
        ref={inputVideoRef}
      ></video>
      <canvas
        ref={canvasRef}
        id="output_canvas"
        style={{
          position: "absolute",
          left: "0px",
          top: "0px",
        }}
      ></canvas>

      {/* Add your routes and components here */}
      {/* <BrowserRouter>
        <Routes>
          <Route path="/class" element={<ClassComponent />} />
          <Route path="/function" element={<FunctionComponent />} />
        </Routes>
      </BrowserRouter> */}
    </div>
  );
}

export default App;

