const express = require('express'),
      bodyParser = require('body-parser'),
      methodOverride = require('method-override'),
      logger = require('morgan');

var db = require('./models');

var app = express();

app.set('view engine', 'hbs');

app.use(logger('dev'));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}));


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

app.get('/admin/posts/:id/edit', (req, res) => {
  db.Post.findOne({
    where: {
      id: req.params.id
    }
  }).then((post) => {
    res.render('posts/edit', { post: post });
  });
});

app.post('/posts', (req, res) => {
  console.log(req.body);
  db.Post.create(req.body).then((post) => {
    res.redirect('/' + post.slug);
  }).catch((error) => {
    throw error;
  });
});

app.put('/posts/:id', (req, res) => {
  db.Post.update(req.body, {
    where: {
      id: req.params.id
    }
  }).then(() => {
    res.redirect('/admin/posts');
  });
});

app.delete('/posts/:id', (req, res) => {
  db.Post.destroy({
    where: {
      id: req.params.id
    }
  }).then(() => {
    res.redirect('/admin/posts');
  });
});


db.sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log('Web server started at port 3000!');
  });
});
