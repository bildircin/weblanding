'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:*/
     await queryInterface.createTable('toursCategories', { 
        id:{
            type:Sequelize.INTEGER,
            allowNull:false,
            primaryKey:true,
            autoIncrement:true
        },
        tourId: {
            type: Sequelize.INTEGER,
            allowNull:false
        },
        categoryId: {
            type: Sequelize.INTEGER,
            allowNull:false
        },
        createdAt:{
            type:Sequelize.DATE,
            allowNull:false
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
     await queryInterface.dropTable('toursCategories');
     
  }
};