var express = require('express'),
    db = require('../models'),
    router = express.Router();

var requireUser = (req, res, next) => {
  if (req.path === '/') {
    return next();
  }

  if (req.session.user) {
    next();
  } else {
    res.redirect('/admin');
  }
};

router.use(requireUser);

router.get('/', (req, res) => {
  if (req.session.user) {
    res.redirect('/admin/posts');
  }

  res.render('login');
});

router.get('/posts', (req, res) => {
  db.Post.findAll().then((blogPosts) => {
    res.render('posts/index', { blogPosts: blogPosts, user: req.session.user });
  }).catch((error) => {
    throw error;
  });
});

router.get('/posts/new', (req, res) => {
  res.render('posts/new', { user: req.session.user });
});

router.get('/posts/:id/edit', (req, res) => {
  db.Post.findOne({
    where: {
      id: req.params.id
    }
  }).then((post) => {
    res.render('posts/edit', { post: post, user: req.session.user });
  });
});

router.post('/posts', (req, res) => {
  db.Post.create(req.body).then((post) => {
    res.redirect('/' + post.slug);
  }).catch((error) => {
    console.log(error);
    res.render('posts/new', { errors: error.errors });
  });
});

router.put('/posts/:id', (req, res) => {
  db.Post.update(req.body, {
    where: {
      id: req.params.id
    }
  }).then(() => {
    res.redirect('/admin/posts');
  });
});

router.delete('/posts/:id', (req, res) => {
  db.Post.destroy({
    where: {
      id: req.params.id
    }
  }).then(() => {
    res.redirect('/admin/posts');
  });
});

module.exports = router;
