import Sequelize from 'sequelize'
import db from '../../db.js'

const Bulletin = db.define('Bulletin', {
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    },
    email:{
        type:Sequelize.STRING
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
    tableName: 'bulletins'
})


export default Bulletin