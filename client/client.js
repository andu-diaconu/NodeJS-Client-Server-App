const axios = require('axios')


///REGISTER
function register(fname, lname, age, email, pass) {
    (async () => {
        let driver = await {
            "f_name": fname,
            "l_name": lname,
            "driver_age": age,
            "email": email,
            "password": pass
        }
        sendInfo(driver)
    })()
}

async function sendInfo(object) {
    let resp = await axios.post('http://localhost:3030/register', object)
    if (resp.status === 200)
        console.log('The driver has been added')
    else
        console.log('An error has occurred')
}

//register('NGolo','Kante',30,'nk@gmail.com','nkpass')


///DELIVERY
function showDeliveries(email, pass) {
    (async () => {
        let driver = await {
            "email": email,
            "password": pass
        }
        receiveInfo(driver)
    })()
}

async function receiveInfo(object) {
    let resp = await axios.post('http://localhost:3030/login', object)
    if (resp.status === 200) {
        var driver_id = resp.data[0].driver_id
        let resp1 = await axios.get(`http://localhost:3030/deliveries/${driver_id}`)
        console.log(resp1.data)
    }
    else {
        console.log(resp.data)
    }
}

//showDeliveries('jc@gmail.com','jcpass')

//RESET PASSWORD
function resetPassword(email, pass, new_pass) {
    (async () => {
        let driver = await {
            "email": email,
            "password": pass,
            "new_password": new_pass
        }
        reqNewPass(driver)
    })()
}

function reqNewPass(object) {
    (async () => {
        let resp = await axios.post('http://localhost:3030/login', object)
        if (resp.status === 200) {
            var driver_id = resp.data[0].driver_id
            let resp1 = await axios.put(`http://localhost:3030/reset/password/${driver_id}`, object)
            console.log(resp1.data)
        }
        else
            console.log('USER OR PASSWORD INCORRECT')
    })()
}
//resetPassword('cp@gmail.com','cppass','cnpass')

//Show/Calculate Salary
function showSalary(email, pass) {
    var driver = {
        "email": email,
        "password": pass
    }
    reqShowSalary(driver)
}

function reqShowSalary(object) {
    (async () => {
        let resp = await axios.post('http://localhost:3030/login', object)
        if (resp.status === 200) {
            var driver_id = resp.data[0].driver_id
            let resp1 = await axios.put(`http://localhost:3030/get/price/${driver_id}`)
            if (resp1.data === '')
                console.log("This driver had no delivery => 0 lei")
            else 
                console.log("Salariu actual : "+resp1.data + " Lei")
        }
        else
            console.log('User or password incorrect')
    })()
}

function EstimatedSalary(email, pass) {
    var driver = {
        "email": email,
        "password": pass
    }
    reqEstimatedSalary(driver)
}

function reqEstimatedSalary(object) {
    (async () => {
            await axios.post('http://localhost:3030/login', object)
            resp1 = await axios.put(`http://localhost:3030/get/estimated/price`)
            if (resp1.data === '') 
                console.log("No next deliveries for this driver")
            else 
                console.log("Salariu estimat : "+ resp1.data + " Lei")
    })()
}

//showSalary('jc@gmail.com', 'jcpass')
EstimatedSalary('jc@gmail.com','jcpass')