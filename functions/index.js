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

// Setup CORS with dynamic origin support
app.use(cors({origin: true}));

// Increase the payload limit by setting the limit option
app.use(express.json({limit: "150mb"}));
app.use(express.urlencoded({limit: "150mb", extended: true}));

app.post("/upload", (req, res) => {
  // Your file upload handling logic here
  // This is where you'd handle the POST request to upload files.
});

exports.upload = functions.https.onRequest(app);

// Note: You can still define other functions like helloWorld below,
// just ensure they don't conflict with above
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   response.send("Hello from Firebase!");
// });
