const db = require('./db')
const express = require('express')
const app = express()
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
require('dotenv').config()
app.use(express.json())
const JWT_KEY = process.env.JWT_KEY
const PORT = process.env.PORT

/// ENCRYPT PASSWORD

algorithm = 'aes-256-ctr',
    password = 'd6F3Efeq';

function encrypt(text) {
    var cipher = crypto.createCipher(algorithm, password)
    var crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex');
    return crypted;
}

app.get('/', (req, res) => {
    res.send('HOME PAGE')
})



///DELIVERIES 



app.get('/deliveries/:driver_id', (req, res) => {
    let driver_info = req.params.driver_id
    db.showDeliveries(driver_info).then(Element => {
        res.status(Element.status).send(Element.delivery_info)
    })
})

app.put('/get/price', ensureToken, (req, res) => {
    let driver_id = req.user.id
    db.calculateSalary(driver_id).then(Element => {
        if (Element.status === 204) {
            db.updateSalary(driver_id, 0)
            res.status(204).send(Element.delivery_info + `Your token expire in ${req.remaining_time}`)
        }
        else {
            let salary = 0
            Element.delivery_info.forEach(element => {
                salary = salary + element.price
            });
            salary = (5 * salary) / 100
            db.updateSalary(driver_id, salary)
            res.status(200).send('Your salary is : ' + salary.toString() + ` lei.Your token expire in ${req.remaining_time}`)
        }
    })
})


app.put('/get/estimated/price', ensureToken, (req, res) => {
    var driver_id = req.user.id
    db.calculateEstimatedSalary(driver_id).then(Element => {
        if (Element.status === 204) {
            db.updateEstimatedSalary(driver_id, 0)
            res.status(204).send(Element.delivery_info + `Your token expire in :${req.remaining_time}`)
        }
        else {
            let salary = 0
            Element.delivery_info.forEach(element => {
                salary = salary + element.price
            });
            salary = (5 * salary) / 100
            db.updateEstimatedSalary(driver_id, salary)
            res.status(200).send('Your estimated salary is : ' + salary.toString() + ` lei. You toke expire in : ${req.remaining_time}`)
        }
    })
})

function ensureToken(req, res, next) {
    const header = req.header("Authorization")
    const token = header.split(' ')[1]
    if (typeof token !== 'undefined') {
        try {
            let user = jwt.verify(token, JWT_KEY)
            let current_time = Math.floor(Date.now() / 1000)
            let remaining_time = current_time - user.exp
            req.remaining_time = remaining_time
            req.user = user
            next()
        }
        catch (err) {
            res.status(401).send('Invalid token or time expired')
        }
    }
    else {
        res.sendStatus(403)
    }
}
/// REGISTER - LOGIN - DELETE



app.post('/login', (req, res) => {
    let driver_info = req.body
    db.login(driver_info.email, encrypt(driver_info.password)).then(Element => {
        if (Element.length !== 0) {
            const limit = 60 * 2; //seconds
            let expires = Math.floor(Date.now() / 1000) + limit
            let user = {
                id: Element[0].driver_id,
                exp: expires
            }
            const token = jwt.sign(user, JWT_KEY);
            res.send(token)
        }
        else {
            res.send('User or password incorrect')
        }
    })
})


app.post('/register', (req, res) => {
    let driver_info = req.body
    const p1 = new Promise((resolve, reject) => {
        db.addDriver(driver_info.f_name, driver_info.l_name, driver_info.driver_age, driver_info.email).then(Element => {
            resolve(Element)
        })
    })
    const p2 = new Promise((resolve, reject) => {
        db.addAuthentication(driver_info.email, encrypt(driver_info.password)).then(Element => {
            resolve(Element)
        })
    })
    Promise.all([p1, p2]).then(Element => {
        res.status(Element[0]).send()
    })
})

app.delete('/delete/:id', (req, res) => {
    var driver_info = req.params.id
    db.deleteDriver(driver_info).then(Element => {
        if (Element.status === 401) {
            res.send(Element.rslt)
        }
        else {
            res.send(Element.rslt)
        }
    })
})



/// EDIT STUFF



/// FIELD
app.put('/edit/:field/:id', (req, res) => {
    var field = req.params.field
    var driver_id = req.params.id
    var body = req.body
    db.editField(field, driver_id, body).then(Element => {
        res.send(Element)
    })
})

/// DIRECT DIN URL
app.put('/edit/:field/:id/:new', (req, res) => {
    var driver_id = req.params.id
    var field = req.params.field
    var body = req.params.new
    db.editFieldd(field, driver_id, body).then(Element => {
        res.send(Element)
    })
})

app.put('/reset/password/:id', (req, res) => {
    var driver_id = req.params.id
    var new_pass = req.body.new_password
    db.resetPass(driver_id, encrypt(new_pass))
    res.status(200).send('Password updated!')
})


app.listen(PORT, () => {
    console.log('Connecting to 3030...')
})