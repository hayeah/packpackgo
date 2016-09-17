const path = require("path");
const isDev = process.env.NODE_ENV === "development";
const url = `file://${path.join(__dirname, "./index.dev.html")}`;
const { launchApp } = require("./build/launchApp");

launchApp(url);
