const express = require('express'),
      logger = require('morgan');

var app = express();

app.set('view engine', 'hbs');

app.use(logger('dev'));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/admin', (req, res) => {
  res.render('posts/index');
});

app.listen(3000, () => {
  console.log('Web server started at port 3000!');
});
