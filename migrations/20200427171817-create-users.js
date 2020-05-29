'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.createTable('Users',
        {
          id: {
            type: Sequelize.DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
          },
          email: Sequelize.DataTypes.STRING,
          password: Sequelize.DataTypes.STRING,
          fname: Sequelize.DataTypes.STRING,
          lname: Sequelize.DataTypes.STRING,
          createdAt: Sequelize.DataTypes.DATE,
          updatedAt: Sequelize.DataTypes.DATE
        });
  },

  down: (queryInterface) => {
      return queryInterface.dropTable('Users');
  }
};
