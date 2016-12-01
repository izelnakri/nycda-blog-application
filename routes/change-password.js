var express = require('express'),
    nodemailer = require('nodemailer'),
    crypto = require('crypto'),
    base64url = require('base64url'),
    db = require('../models'),
    router = express.Router();


var transporter = nodemailer.createTransport(
  'smtps://nycdaamswdi%40gmail.com:' + process.env.BLOG_APP_EMAIL_PASSWORD +'@smtp.gmail.com'
);

router.get('/forgot-password', (req, res) => {
  res.render('forgot-password');
});

router.post('/forgot-password', (req, res) => {
  db.User.findOne({
    where: {
      email: req.body.email
    }
  }).then((user) => {
    if (user) {
      user.passwordResetToken = base64url(crypto.randomBytes(48));
      user.save().then((user) => {
        transporter.sendMail({
          to: user.email,
          subject: 'Blog routerlication password change request',
          text: `
            Hi there,

            You have requested to change your password. If you haven't requested it please ignore this email.
            You can change your password below:

            http://localhost:3000/change-password/${user.passwordResetToken}
          `
        }, (error, info) => {
          if (error) { throw error; }
          console.log('Password reset email sent:');
          console.log(info);
        });
      });

      res.redirect('/');
    } else {
      res.redirect('/forgot-password');
    }
  });
});

router.get('/change-password/:passwordResetToken', (req, res) => {
  db.User.findOne({
    where: {
      passwordResetToken: req.params.passwordResetToken
    }
  }).then((user) => {
    res.render('change-password', { user: user });
  });
});

router.post('/change-password/:passwordResetToken', (req, res) => {
  db.User.findOne({
    where: {
      passwordResetToken: req.params.passwordResetToken
    }
  }).then((user) => {
    user.password = req.body.password;
    user.save().then((user) => {
      req.session.user = user;
      res.redirect('/');
    }).catch((error) => {
      res.redirect('/change-password/' + req.params.passwordResetToken);
    });

  });
});

module.exports = router;
