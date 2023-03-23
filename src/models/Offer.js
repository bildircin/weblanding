import Sequelize from 'sequelize'
import db from '../../db.js'

const Offer = db.define('Offer', {
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
},
{
    tableName: 'offers'
})


export default Offer