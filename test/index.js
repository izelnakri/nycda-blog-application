process.env.NODE_ENV = 'test';

const assert = require('assert'),
      db = require('../models');

describe('MODEL: POST', () => {
  before((done) => {
    db.sequelize.sync({ force: true }).then(() => {
      done();
    });
  });

  it('creates a blog post', (done) => {
    db.Post.create({
      title: 'Izels great blog article',
      slug: 'our test slug',
      content: '<h1>I\'m awesome!</h1>'
    }).then((post) => {
      assert.equal(post.isNewRecord, false);
      assert.equal(post.title, 'Izels great blog article');
      assert.equal(post.slug, 'our test slug');
      assert.equal(post.content, '<h1>I\'m awesome!</h1>');
      done();
    });
  });

  it('cannot create a post if title is missing', (done) => {
    db.Post.create({
      slug: 'our test slug',
      content: '<h1>I\'m awesome!</h1>'
    }).catch((error) => {
      assert.equal(error.errors[0].message, 'title cannot be null');
      assert.equal(error.errors.length, 1);
      done();
    });
  });

  it('cannot create a post if content is missing', (done) => {
    db.Post.create({
      title: 'Izels great blog article',
      slug: 'our test slug'
    }).catch((error) => {
      assert.equal(error.errors[0].message, 'content cannot be null');
      assert.equal(error.errors.length, 1);
      done();
    });
  });

  it('generates a slug during post creation if post has no slug', (done) => {
    db.Post.create({
      title: 'This should get sluggified',
      content: '<h1>I\'m awesome!</h1>'
    }).then((post) => {
      assert.equal(post.slug, 'this-should-get-sluggified');
      done();
    });
  });

  it('updates a blog post', (done) => {
    db.Post.update({
      title: 'Updated new title',
      content: '<h5>New Content</h5>',
      slug: 'our-new-slug'
    }, {
      where: {
        title: 'Izels great blog article'
      },
      returning: true
    }).then((updateData) => {
      var post = updateData[1][0];
      assert.equal(post.title, 'Updated new title');
      assert.equal(post.content, '<h5>New Content</h5>');
      assert.equal(post.slug, 'our-new-slug');
      done();
    });
  });

  it('deletes a blog post', (done) => {
    db.Post.destroy({
      where: {
        title: 'This should get sluggified'
      }
    }).then((destroyRecordCount) => {
      assert.equal(destroyRecordCount, 1);
      done();
    });
  });
});
