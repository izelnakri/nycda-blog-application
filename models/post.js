var slug = require('slug');

module.exports = function(sequelize, DataTypes) {
  var Post = sequelize.define('Post', {
    title: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Post title cannot be empty'
        }
      }
    },
    slug: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Post slug cannot be empty'
        }
      }
    },
    content: {
      type: DataTypes.TEXT,
      validate: {
        notEmpty: {
          msg: 'Post content cannot be empty'
        }
      },
      lengthValidator: function(content) {
        if (content.length < 15) {
          throw new Error('Post content is too short');
        }
      }
    }
  }, {
    hooks: {
      beforeCreate: function(post, options) {
        if (!post.slug) {
          post.slug = slug(post.title, { lower: true });
        }
      }
    },
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        this.hasMany(models.Comment);
      }
    }
  });

  return Post;
};
