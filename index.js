const express = require('express'),
      bodyParser = require('body-parser'),
      methodOverride = require('method-override'),
      session = require('express-session'),
      displayRoutes = require('express-routemap'),
      bcrypt = require('bcrypt'),
      crypto = require('crypto'),
      base64url = require('base64url'),
      nodemailer = require('nodemailer'),
      logger = require('morgan');

var transporter = nodemailer.createTransport(
  'smtps://nycdaamswdi%40gmail.com:' + process.env.BLOG_APP_EMAIL_PASSWORD +'@smtp.gmail.com'
);

var db = require('./models');

var app = express();

var adminRouter = require('./routes/admin');

app.set('view engine', 'hbs');

app.use(logger('dev'));

app.use(session({
  name: 'izels-session-cookie',
  secret: 'our secret key',
  resave: true,
  saveUninitialized: true
}));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

app.use('/admin', adminRouter);

app.post('/posts/:id/comments', (req, res) => {
  db.Post.findById(req.params.id).then((post) => {
    var comment = req.body;
    comment.PostId = post.id;

    db.Comment.create(comment).then(() => {
      res.redirect('/' + post.slug);
    });
  });
});

app.get('/', (req, res) => {
  console.log(req.session);
  db.Post.findAll({ order: [['createdAt', 'DESC']] }).then((blogPosts) => {
    res.render('index', { blogPosts: blogPosts, user: req.session.user });
  });
});

app.get('/register', (req, res) => {
  if (req.session.user) {
    res.redirect('/admin/posts');
  }

  res.render('users/new');
});

app.get('/login', (req, res) => {
  res.redirect('/admin');
});

app.post('/login', (req, res) => {
  console.log(req.body);

  db.User.findOne({
    where: {
      email: req.body.email
    }
  }).then((userInDB) => {
    bcrypt.compare(req.body.password, userInDB.password, (error, result) => {
      if (result) {
        req.session.user = userInDB;
        res.redirect('/');
      } else {
        res.redirect('/login');
      }
    });
  }).catch(() => {
    res.redirect('/login');
  });
});

app.get('/logout', (req, res) => {
  req.session.user = undefined;
  res.redirect('/');
});

app.post('/users', (req, res) => {
  db.User.create(req.body).then((user) => {
    res.redirect('/');
  }).catch(() => {
    res.redirect('/register');
  });
});

app.get('/forgot-password', (req, res) => {
  res.render('forgot-password');
});

app.post('/forgot-password', (req, res) => {
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
          subject: 'Blog application password change request',
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

app.get('/change-password/:passwordResetToken', (req, res) => {
  db.User.findOne({
    where: {
      passwordResetToken: req.params.passwordResetToken
    }
  }).then((user) => {
    res.render('change-password', { user: user });
  });
});

app.post('/change-password/:passwordResetToken', (req, res) => {
  db.User.findOne({
    where: {
      passwordResetToken: req.params.passwordResetToken
    }
  }).then((user) => {
    user.password = req.params.password;
    user.save().then((user) => {
      res.redirect('/');
    }).catch((error) => {
      res.redirect('/change-password/' + req.params.passwordResetToken);
    });
  });
});

app.get('/:slug', (req, res) => {
  db.Post.findOne({
    where: {
      slug: req.params.slug
    }
  }).then((post) => {
    return post.getComments().then((comments) => {
      res.render('posts/show', { post: post, comments: comments, user: req.session.user });
    });
  }).catch((error) => {
    res.status(404).end();
  });
});

db.sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log('Web server started at port 3000!');
    displayRoutes(app);
  });
});
