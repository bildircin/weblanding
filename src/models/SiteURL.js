import Sequelize from 'sequelize'
import db from '../../db.js'

const SiteURL = db.define('SiteURL', {
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
},
{
    tableName: 'siteurls'
})


export default SiteURL