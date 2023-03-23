'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:*/
     await queryInterface.createTable('offers', { 
        id:{
            type:Sequelize.INTEGER,
            allowNull:false,
            primaryKey:true,
            autoIncrement:true
        },
        name:{
            type:Sequelize.STRING
        },
        email:{
            type:Sequelize.STRING
        },
        phone:{
            type:Sequelize.INTEGER(15),
            defaultValue:null
        },
        description:{
            type:Sequelize.TEXT('long')
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
     await queryInterface.dropTable('offers');
     
  }
};