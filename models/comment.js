'use strict';
module.exports = function(sequelize, DataTypes) {
  var Comment = sequelize.define('Comment', {
    content: DataTypes.TEXT,
    PostId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Posts",
        key: "id"
      }
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        this.belongsTo(models.Post);
      }
    }
  });
  return Comment;
};
