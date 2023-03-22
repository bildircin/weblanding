import Sequelize from 'sequelize'
// const db = new Sequelize('SimpleDataDB', 'IAmSimpleDataDBUser', 'Nneq69?56', {
//     host:"185.86.155.130",
//     dialect:"mssql",
//     dialectOptions: {
//         encrypt: "true" // bool - true - doesn't work either
//       }
// })

const db = new Sequelize('videodatadb', 'root', 'Celsius*123', {
    host:"localhost",
    dialect:"mysql",
    dialectOptions: {
        encrypt: "true" // bool - true - doesn't work either
      }
})


export default db;