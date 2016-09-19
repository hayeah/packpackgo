const path = require("path");
const isDev = process.env.NODE_ENV === "development";
const url = `file://${path.join(__dirname, "./build/index.html")}`;
const { launchApp } = require("./build/launchApp");

launchApp(url);