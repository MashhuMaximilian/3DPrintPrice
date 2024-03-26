// bundleAssets.js
const functions = require("firebase-functions");
const axios = require("axios");
const jszip = require("jszip");

exports.bundleAssets = functions.https.onRequest(async (request, response) => {
  const assetUrls = request.body.urls;

  try {
    /* eslint-disable new-cap */
    const zip = new jszip();
    for (const url of assetUrls) {
      const {data, headers}=await axios.get(url, {responseType: "arraybuffer"});
      const filename = url.split("/").pop();
      zip.file(filename, data, {binary: true});
    }
    const bundledAsset = await zip.generateAsync({type: "nodebuffer"});
    response.setHeader("Content-Type", "application/zip");
    /* eslint-disable */
    response.setHeader("Content-Disposition", 'attachment; filename="bundle.zip"');
    response.send(bundledAsset);
  } catch (error) {
    response.status(500).send(error);
  }
});
