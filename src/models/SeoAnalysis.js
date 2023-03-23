import Sequelize from 'sequelize'
import db from '../../db.js'

const SeoAnalysis = db.define('SeoAnalysis', {
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
    url:{
        type:Sequelize.STRING
    },
    companyName:{
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
    tableName: 'seoanalyzes'
})


export default SeoAnalysis