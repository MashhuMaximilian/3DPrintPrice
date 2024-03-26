// streamAssetChunk.js
const functions = require("firebase-functions");
const fs = require("fs");
const path = require("path");

exports.streamAssetChunk= functions.https.onRequest(async (request, response)=>{
  const assetPath = request.query.path;

  try {
    const asset = fs.readFileSync(path.join("assets", assetPath));
    response.setHeader("Content-Type", "application/octet-stream");
    response.send(asset);
  } catch (error) {
    response.status(500).send(error);
  }
});
