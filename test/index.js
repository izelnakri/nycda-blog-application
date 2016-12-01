var assert = require('assert');
var db = require('../models');


describe('First Test', (done) => {
  before(() => {
    db.sequelize.sync({ force: true }).then(() => {
      done();
    });
  });

  it('creating a blog Post persists a blog Post in the database', (done) => {
    db.Post.create({
      title: 'Izels great blog article',
      content: '<h1>I\'m awesome!</h1>'
    }).then(() => {
      db.Post.findOne({
        where: {
          title: 'Izels great blog article'
        }
      }).then((post) => {
        assert.equal(post.title, 'Izels great blog article');
        assert.equal(post.content, '<h1>I\'m awesome!</h1>');
        done();
      });
    });
  });

  it('creating a blog Post with an existing slug shouldn\'t be allowed', () => {

  });
});
