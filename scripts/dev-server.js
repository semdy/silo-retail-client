const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const compression = require('compression')
const microcache = require('route-cache')
const useMicroCache = process.env.MICRO_CACHE !== 'false'
const isNoHtml = process.env.RENDER_MODE === 'nohtml';

let serverRenderer;

if (process.env.NODE_ENV === 'production') {
  let serverRendererPath = path.join(__dirname, '..', 'dist/static/scripts/renderer.js');
  let renderer = require(serverRendererPath).default;
  serverRenderer = (req, res, next) => renderer(req, res, next, isNoHtml);
} else {
  serverRenderer = require('../src/entry-server').default;
}

const PORT = process.env.PORT || 8000;
const app = express();

app.use(compression({ threshold: 0 }))
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// 1-second microcache.
// https://www.nginx.com/blog/benefits-of-microcaching-nginx/
app.use(microcache.cacheSeconds(1, req => useMicroCache && req.originalUrl))

if (process.env.NODE_ENV === 'development') {
  const chokidar = require('chokidar');
  const webpack = require('webpack');
  const webpackMiddleware = require('webpack-dev-middleware');
  const hotMiddleware = require('webpack-hot-middleware');
  const config = require('./config/webpack.config.dev.js');
  const compiler = webpack(config);

  app.use(hotMiddleware(compiler, {
    log: console.log,
    heartbeat: 10 * 1000,
  }));
  app.use(webpackMiddleware(compiler, {
    publicPath: config.output.publicPath,
    serverSideRender: true,
  }));

  // Do 'hot-reloading' of express stuff on the server
  // Throw away cached modules and re-require next time
  // Ensure there's no important state in there!
  const watcher = chokidar.watch('./');

  watcher.on('ready', () => {
    watcher.on('all', () => {
      console.log('Clearing /server/ module cache from server');
      Object.keys(require.cache).forEach((id) => {
        if (/[\/\\]server[\/\\]/.test(id)) delete require.cache[id];
      });
    });
  });

  // Do 'hot-reloading' of react stuff on the server
  // Throw away the cached client modules and let them be re-required next time
  compiler.plugin('done', () => {
    console.log('Clearing /src/ module cache from server');
    Object.keys(require.cache).forEach((id) => {
      if (/[\/\\]src[\/\\]/.test(id)) delete require.cache[id];
    });
  });
}
else {
  app.use(express.static(path.resolve(__dirname, '..', 'dist')));
}

app.use('*', serverRenderer);

app.listen(PORT, (error) => {
  if (error) {
    return console.log('something bad happened', error);
  }

  console.log(`${process.env.NODE_ENV} app listening on ${PORT}\n`);
  console.log(` --  launched @ ${Date()}  --`);
  console.log('-------------------------------------------------------------------------------------\n\n');
});