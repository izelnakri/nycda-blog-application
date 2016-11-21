var slug = require('slug');

module.exports = function(sequelize, DataTypes) {
  var Post = sequelize.define('Post', {
    title: DataTypes.STRING,
    slug: DataTypes.STRING,
    content: DataTypes.TEXT
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
