// optimizeAsset.js
const functions = require("firebase-functions");
const gltfPipeline = require("gltf-pipeline");

exports.optimizeAsset = functions.https.onRequest(async (request, response) => {
  const assetUrl = request.query.url;

  try {
    if (assetUrl.endsWith(".glb") || assetUrl.endsWith(".gltf")) {
      // Optimize GLB/GLTF asset using gltf-pipeline
      const optimizedAsset = await gltfPipeline.process(assetUrl);
      response.send(optimizedAsset);
    } else {
      response.status(400).send("Unsupported asset type");
    }
  } catch (error) {
    response.status(500).send(error);
  }
});
