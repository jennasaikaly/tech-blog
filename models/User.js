//imports model class and DataTypes object from Sequelize
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const bcrypt = require('bcrypt');
// create our User model
//the model class is what we create our own models from using the 'extends' keyword
//so User inherits all of the functionality of the Model class.
class User extends Model {
   // set up method to run on instance data (per user) to check password
   checkPassword(loginPw) {
    return bcrypt.compareSync(loginPw, this.password);
  }
}

// define table columns and configuration
User.init(
     // TABLE COLUMN DEFINITIONS GO HERE
  {
     // define an id column
  id: {
   type: DataTypes.INTEGER,
    // this is the equivalent of SQL's `NOT NULL` option
    allowNull: false,
    // instruct that this is the Primary Key
    primaryKey: true,
    // turn on auto increment
    autoIncrement: true
  },
  // define a username column
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  // define an email column
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    // there cannot be any duplicate email values in this table
    unique: true,
    // if allowNull is set to false, we can run our data through validators before creating the table data
    validate: {
      isEmail: true
    }
  },
  // define a password column
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      // this means the password must be at least six characters long
      len: [6]
    }
  }
},
  {
    hooks: {
      // set up beforeCreate lifecycle "hook" functionality
      async beforeCreate(newUserData) {
        newUserData.password = await bcrypt.hash(newUserData.password, 10);
        return newUserData;
      },
      async beforeUpdate(updatedUserData) {
        updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
        return updatedUserData;
      }
    },
    // pass in our imported sequelize connection (the direct connection to our database)
    sequelize,
    // don't automatically create createdAt/updatedAt timestamp fields
    timestamps: false,
    // don't pluralize name of database table
    freezeTableName: true,
    // use underscores instead of camel-casing (i.e. `comment_text` and not `commentText`)
    underscored: true,
    // make it so our model name stays lowercase in the database
    modelName: 'user'
  }
);

module.exports = User;
