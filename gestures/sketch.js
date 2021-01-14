
// Classifier Variable
let classifier;
// Model URL
let imageModelURL = 'https://teachablemachine.withgoogle.com/models/fO_TFe_ir/';

// Video
let baseVideo;
let flippedBaseVideo;
let classificationVideo;
// To store the classification
const defaultLabel = "Background";
let label = "";
let lastLabelLength = 5;
let lastLabels = new Array(lastLabelLength); // Used as LIFO Stack
lastLabels.fill(defaultLabel); // Fill the stack with the default label

const confidenceThreshold = 0.975
const outputWidth = 640;
const outputHeight = 360;
const classificationWidth = 160;
const classificationHeight = 90;

// Used to ensure that all variables in an array have the same value
const allEqual = arr => arr.every( v => v === arr[0] )

// Display Icons
let circleMask
let thumbsUp;
let thumbsUpFade = 0;


// Load the model first
function preload() {
  classifier = ml5.imageClassifier(imageModelURL + 'model.json');
  thumbsUp = loadImage("thumbs_up.jpg");
}

function setup() {
  createCanvas(outputWidth, outputHeight);

  // Create the video
  baseVideo = createCapture(VIDEO);
  classificationVideo = createCapture(VIDEO);

  baseVideo.size(outputWidth, outputHeight);
  classificationVideo.size(classificationWidth, classificationHeight);

  baseVideo.hide();
  classificationVideo.hide();

  circleMaskSize = Math.sqrt(outputWidth * outputHeight) / 3
  circleMask = createGraphics(circleMaskSize, circleMaskSize);
  circleMask.fill('rgba(0, 0, 0, 1)');
  circleMask.circle(circleMaskSize/2, circleMaskSize/2, circleMaskSize);
  thumbsUp.mask(circleMask);

  // Start classifying
  classifyVideo();
}

function draw() {
  background(0);
  tint(255)


  flippedBaseVideo = ml5.flipImage(baseVideo);
  // Draw the video

  //flip everything
  //translate(outputWidth,0); // move to far corner
  //scale(-1.0,1.0);    // flip x-axis backwards

  image(flippedBaseVideo, 0, 0, outputWidth, outputHeight); //video on canvas, position, dimensions

  // Display the icon
  if (label === 'Thumbs Up') {
    console.log("Displaying Thumbs Up Icon");
    thumbsUpFade = 255;
  }

  if (thumbsUpFade > 0) {
    tint(255, thumbsUpFade)
    image(thumbsUp, circleMaskSize/10, circleMaskSize/10, circleMaskSize, circleMaskSize);
    thumbsUpFade -= 10;
  }

  flippedBaseVideo.remove();

}

// Get a prediction for the current video frame
function classifyVideo() {
  classifier.classify(classificationVideo, gotResult);
  classificationVideo.remove();

  if (document.getElementById("toggleClassification").checked) {

  } else {
    sleep(100).then(() => { classifyVideo() });
  }
}

// When we get a result
function gotResult(error, results) {
  // If there is an error
  if (error) {
    console.error(error);
    return;
  }

  // The results are in an array ordered by confidence.
  //console.log(results);

  // Only change default label if confidence greater than threshold
  if (results[0].confidence > confidenceThreshold) {
    lastLabels.shift() // Removes the first label from stack
    lastLabels.push(results[0].label); // Adds a new label into the stack
  }

  if (allEqual(lastLabels)) {
    label = lastLabels[0]
  } else {
    label = "Background"
  }

  // Write label into html
  document.getElementById("gesture").textContent=label;

  // Classifiy again!
  classifyVideo();
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
