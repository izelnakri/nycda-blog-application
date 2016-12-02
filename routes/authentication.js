var express = require('express'),
    bcrypt = require('bcrypt'),
    db = require('../models'),
    router = express.Router();

router.get('/register', (req, res) => {
  if (req.session.user) {
    res.redirect('/admin/posts');
  }

  res.render('users/new');
});

router.post('/register', (req, res) => {
  db.User.create(req.body).then((user) => {
    req.session.user = user;
    res.redirect('/');
  }).catch((error) => {
    res.render('users/new', { errors: error.errors });
  });
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', (req, res) => {
  db.User.findOne({
    where: {
      email: req.body.email
    }
  }).then((userInDB) => {
    bcrypt.compare(req.body.password, userInDB.passwordDigest, (error, result) => {
      if (result) {
        req.session.user = userInDB;
        res.redirect('/');
      } else {
        res.render('login', { error: { message: 'Password is incorrect' } });
      }
    });
  }).catch((error) => {
    res.render('login', { error: { message: 'User not found in the database' } });
  });
});

router.get('/logout', (req, res) => {
  req.session.user = undefined;
  res.redirect('/');
});

module.exports = router;
