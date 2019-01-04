const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');

let serverRenderer;

if (process.env.NODE_ENV === 'production') {
  let serverRendererPath = path.join(__dirname, '..', 'dist/static/scripts/renderer.js');
  serverRenderer = require(serverRendererPath).default;
} else {
  serverRenderer = require('../src/entry-server').default;
}

const PORT = process.env.PORT || 8000;
const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, '..', 'dist')));
app.use("*", serverRenderer);

app.listen(PORT, (error) => {
  if (error) {
    return console.log('something bad happened', error);
  }

  console.log("listening on " + PORT + "...");
});