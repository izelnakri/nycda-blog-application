const express = require('express'),
      bodyParser = require('body-parser'),
      logger = require('morgan');

var db = require('./models');

var app = express();

app.set('view engine', 'hbs');

app.use(logger('dev'));

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  db.Post.findAll().then((blogPosts) => {
    res.render('index', { blogPosts: blogPosts });
  });
});

app.get('/:slug', (req, res) => {
  db.Post.findOne({
    where: {
      slug: req.params.slug
    }
  }).then((post) => {
    res.render('posts/show', { post: post });
  }).catch((error) => {
    res.status(404).end();
  });
});

app.get('/admin/posts', (req, res) => {
  db.Post.findAll().then((blogPosts) => {
    res.render('posts/index', { blogPosts: blogPosts });
  }).catch((error) => {
    throw error;
  });
});

app.get('/admin/posts/new', (req, res) => {
  res.render('posts/new');
});

app.post('/posts', (req, res) => {
  console.log(req.body);
  db.Post.create(req.body).then((post) => {
    res.redirect('/' + post.slug);
  }).catch((error) => {
    throw error;
  });
});

db.sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log('Web server started at port 3000!');
  });
});
