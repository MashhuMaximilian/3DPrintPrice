// babel.config.js
module.exports = {
  presets: [
    // Preset to compile your modern Js down to Node.js supported version
    ["@babel/preset-env", {targets: {node: "current"}}],
  ],
};
