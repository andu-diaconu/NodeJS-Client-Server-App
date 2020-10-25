const mysql = require('mysql')

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "delivery"
})



/// SALARY

exports.calculateSalary = function calculateSalary(id){
    var sql = `SELECT price FROM delivery WHERE driver_id = ${id} AND date <= CURDATE() `
    const promise_3 = new Promise((resolve, reject) => {
        con.query(sql, function (err, result) {
            if (err) reject(err)
            if (result.length === 0) {
                var driver = { status: 204, delivery_info: 'This user hasnt any delivery' }
                resolve(driver)
            }
            else {
                var driver = { status: 200, delivery_info: result }
                resolve(driver)
            }
        })
    })
    return promise_3
}

exports.updateSalary = function updateSalary(id,salary){
    var sql = `UPDATE salary SET Salary = ${salary} WHERE driver_id = ${id}`;
      con.query(sql, function (err, result) {
          if (err) throw err
          console.log('The salary was Inserted')
        })
}
  
exports.calculateEstimatedSalary = function calculateSalary(id){
    var sql = `SELECT price FROM delivery WHERE driver_id = ${id} AND date >= CURDATE() `
    const promise_3 = new Promise((resolve, reject) => {
        con.query(sql, function (err, result) {
            if (err) reject(err)
            if (result.length === 0) {
                var driver = { status: 204, delivery_info: 'This user hasnt any delivery' }
                resolve(driver)
            }
            else {
                var driver = { status: 200, delivery_info: result }
                resolve(driver)
            }
        })
    })
    return promise_3
}

exports.updateEstimatedSalary = function updateSalary(id,salary){
    var sql = `UPDATE salary SET Estimated_Salary = ${salary} WHERE driver_id = ${id}`;
    con.query(sql, function (err, result) {
          if (err) throw err
          console.log('The salary was Inserted')
        })
  }


//// DRIVER REGISTER - LOGIN  - DELETE

exports.addDriver = function addDriver(fname, lname, age, email) {
    var sql = `INSERT INTO drivers (first_name , last_name , age , email) VALUES ('${fname}', '${lname}', ${age} , '${email}')`
    const promise_1 = new Promise((resolve, reject) => {
        con.query(sql, function (err, res) {
            if (err) reject(err)
            resolve(200)
        })
    })
    return promise_1
}

exports.addAuthentication = function addAuthentication(email, pass) {
    var sql = `INSERT INTO authentication (email , password) VALUES ('${email}','${pass}')`
    const promise_4 = new Promise((resolve, reject) => {
        con.query(sql, function (err, res) {
            if (err) reject(err)
            resolve(200)
        })
    })
    return promise_4
}

exports.deleteDriver = function deleteDriver(id) {
    var sql = `DELETE FROM drivers WHERE driver_id = ${id} `
    var sql_1 = `DELETE FROM delivery WHERE driver_id = ${id}`
    var sql_2 = `DELETE FROM authentication WHERE driver_id = ${id}`
    const promise_5 = new Promise((resolve, reject) => {
        con.query(sql, function (err, result) {
            if (err) reject(err);
            console.log("Number of records deleted from DRIVERS: " + result.affectedRows);
            if (result.affectedRows === 0) {
                var driver = {
                    status: 401,
                    rslt: 'The driver_id is invalid'
                }
                resolve(driver)
            }
            else {
                con.query(sql_1, function (err, result) {
                    if (err) throw err;
                    console.log("Number of records deleted from DELIVERIES " + result.affectedRows);
                });
                con.query(sql_2, function (err, result) {
                    if (err) throw err;
                    console.log("Number of records deleted from AUTHENTICATION " + result.affectedRows);
                });
                var driv = {
                    status: 200,
                    rslt: 'The driver has been deleted'
                }
                resolve(driv)
            }
        });
    })
    return promise_5
}

exports.login = function login(email, pass) {
    var sql = `SELECT driver_id FROM authentication WHERE email = '${email}' AND password = '${pass}'`
    const promise_2 = new Promise((resolve, reject) => {
        con.query(sql, function (err, res) {
            if (err) reject(err)
            resolve(res)
        })
    })
    return promise_2
}





/// DELIVERIES


function addDelivery(driver_id, adress, date, object, weight,price) {
    var sql = `INSERT INTO delivery (driver_id,adress,date,object,weight,price) VALUES (${driver_id},'${adress}','${date}','${object}',${weight} , ${price})`
    con.query(sql, function (err, res) {
        if (err) throw err
        console.log('Delivery inserted')
    })
}
exports.showDeliveries = function showDeliveries(driver_id) {

    var sql = `SELECT adress , date , object FROM delivery WHERE driver_id = ${driver_id} AND date >= CURDATE() `
    const promise_3 = new Promise((resolve, reject) => {
        con.query(sql, function (err, result) {
            if (err) reject(err)
            if (result.length === 0) {
                var driver = { status: 200, delivery_info: 'This driver hasnt`t any delivery' }
                resolve(driver)
            }
            else {
                var driver = { status: 200, delivery_info: result }
                resolve(driver)
            }
        })
    })
    return promise_3
}




/// EDIT STUFF


/////JSON
exports.editField = function editField(field, id, body) {
    if (field === 'age')
        var sql = `UPDATE drivers SET ${field} = ${body.field} WHERE driver_id = ${id}`
    else
        var sql = `UPDATE drivers SET ${field} = '${body.field}' WHERE driver_id = ${id}`
    const promise_8 = new Promise((resolve, reject) => {
        con.query(sql, function (err, res) {
            if (err) reject(err)
            console.log(res)
            if (res.affectedRows === 0) {
                var message = 'The user not found'
                resolve(message)
            }
            else {
                var mess = 'The driver has been edited'
                resolve(mess)
            }
        })
    })
    return promise_8
}

exports.editFieldd = function editFieldd(field, id, body) {
    if (field === 'age')
        var sql = `UPDATE drivers SET ${field} = ${body} WHERE driver_id = ${id}`
    else
        var sql = `UPDATE drivers SET ${field} = '${body}' WHERE driver_id = ${id}`
    const promise_8 = new Promise((resolve, reject) => {
        con.query(sql, function (err, res) {
            if (err) reject(err)
            console.log(res)
            if (res.affectedRows === 0) {
                var message = 'The user not found'
                resolve(message)
            }
            else {
                var mess = 'The driver has been edited'
                resolve(mess)
            }
        })
    })
    return promise_8
}

exports.resetPass = function resetPass(id, new_pass) {
    var sql = `UPDATE authentication SET password = '${new_pass}' WHERE driver_id = ${id}`
    con.query(sql, function (err, res) {
        if (err) throw err
        console.log(res)
    })
}