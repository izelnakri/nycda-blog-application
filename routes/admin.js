var express = require('express'),
    db = require('../models'),
    router = express.Router();

router.get('/posts', (req, res) => {
  if (req.session.user) {
    db.Post.findAll().then((blogPosts) => {
      res.render('posts/index', { blogPosts: blogPosts });
    }).catch((error) => {
      throw error;
    });
  } else {
    res.redirect('/login');
  }
});

router.get('/posts/new', (req, res) => {
  if (req.session.user) {
    res.render('posts/new');
  } else {
    res.redirect('/login');
  }
});

router.get('/posts/:id/edit', (req, res) => {
  if (req.session.user) {
    db.Post.findOne({
      where: {
        id: req.params.id
      }
    }).then((post) => {
      res.render('posts/edit', { post: post });
    });
  } else {
    res.redirect('/login');
  }
});

router.post('/posts', (req, res) => {
  if (req.session.user) {
    db.Post.create(req.body).then((post) => {
      res.redirect('/' + post.slug);
    });
  } else {
    res.redirect('/login');
  }
});

router.put('/posts/:id', (req, res) => {
  if (req.session.user) {
    db.Post.update(req.body, {
      where: {
        id: req.params.id
      }
    }).then(() => {
      res.redirect('/admin/posts');
    });
  } else {
    res.redirect('/login');
  }
});

router.delete('/posts/:id', (req, res) => {
  if (req.session.user) {
    db.Post.destroy({
      where: {
        id: req.params.id
      }
    }).then(() => {
      res.redirect('/admin/posts');
    });
  } else {
    res.redirect('/login');
  }
});

module.exports = router;
