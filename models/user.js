const bcrypt = require('bcrypt');

'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    name: {
      type: DataTypes.STRING
    },
    surname: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Email cannot be empty'
        },
        isEmail: {
          msg: 'Email must be a valid email format'
        },
        lengthMatcher: function(value) {
          if (value.length < 2 || value.length > 100) {
            throw new Error('Email must be between 2 to 100 characters');
          }
        }
      }
    },
    password: {
      type: DataTypes.VIRTUAL,
      validate: {
        notEmpty: {
          msg: 'Password cannot be empty'
        },
        passwordLenghtChecker: function(value) {
          if (value.length < 5 || value.length > 40) {
            throw new Error('Password must be between 5 to 40 characters');
          }
        }
      },
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
        this.hasMany(models.Post);
      }
    },
    hooks: {
      beforeCreate: function(user, options) {
      }
    },
  });
  return User;
};
