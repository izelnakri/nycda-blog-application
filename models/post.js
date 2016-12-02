var slug = require('slug');

module.exports = function(sequelize, DataTypes) {
  var Post = sequelize.define('Post', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        lengthValidator: function(content) {
          if (content.length < 15) {
            throw new Error('Post content is too short');
          }
        }
      },
    }
  }, {
    hooks: {
      beforeValidate: function(post, options) {
        if (!post.slug) {
          post.slug = slug(post.title, { lower: true });
        }
      }
    },
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        this.hasMany(models.Comment);
        this.belongsTo(models.User);
      }
    }
  });

  return Post;
};
