# gesture-recognition
Uses a pre-trained "teachable machine" model for gesture recognition and adds an proper icon to the video stream of the webcam using p5.js 
Currently only the "thumbs up" gesture is supported.

To use it for own purposes, an image model needs to be trained here: https://teachablemachine.withgoogle.com/train/image
The trained model is then uploaded and the generated link must be replaced under gesture/sketch.js
