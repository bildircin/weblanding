'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:*/
     await queryInterface.createTable('siteurls', { 
        id:{
            type:Sequelize.INTEGER,
            allowNull:false,
            primaryKey:true,
            autoIncrement:true
        },
        url:{
            type:Sequelize.STRING
        },
        email:{
            type:Sequelize.STRING
        },
        createdAt:{
            type:Sequelize.DATE,
            allowNull:false
        },
        isReview:{
            type:Sequelize.BOOLEAN,
            allowNull:false,
            defaultValue:false
        },
        updatedAt:{
            type:Sequelize.DATE,
            allowNull:false
        }
     });
     
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:*/
     await queryInterface.dropTable('siteurls');
     
  }
};