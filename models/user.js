const bcrypt = require('bcrypt');

'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    name: {
      type: DataTypes.STRING
    },
    surname: DataTypes.STRING,
    email: DataTypes.STRING,
    password: {
      type: DataTypes.VIRTUAL,
      set: function(password) {
        this.setDataValue('passwordDigest', bcrypt.hashSync(password, 10));
      }
    },
    fullName: {
      type: DataTypes.VIRTUAL,
      get: function() {
        return this.getDataValue('name') + ' ' + this.getDataValue('surname');
      }
    },
    passwordDigest: DataTypes.STRING,
    passwordResetToken: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    },
    hooks: {
      beforeCreate: function(user, options) {
      }
    },
  });
  return User;
};
