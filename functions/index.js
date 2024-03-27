/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");

const app = express();
const bodyParser = require("body-parser");

// Increase the payload limit for raw types
app.use(bodyParser.raw({type: "application/octet-stream", limit: "150mb"}));

// Setup CORS with dynamic origin support
app.use(cors({origin: true}));

// Increase the payload limit by setting the limit option
app.use(express.json({limit: "150mb"}));
app.use(express.urlencoded({limit: "150mb", extended: true}));

app.post("/upload", (req, res) => {
  // Your file upload handling logic here
  // This is where you'd handle the POST request to upload files.
});

// Use runWith to configure memory and timeout for the upload function
exports.upload = functions.runWith({
  timeoutSeconds: 300,
  memory: "1GB",
}).https.onRequest(app);

// index.js
const optimizeAsset = require("./optimizeAsset");


exports.optimizeAsset = optimizeAsset.optimizeAsset;

// exports.helloWorld = functions.https.onRequest((request, response) => {
//   response.send("Hello from Firebase!");
// });
