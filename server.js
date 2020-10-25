const db = require('./db')
const express = require ('express')
const app = express()
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
app.use(express.json())

/// ENCRYPT PASSWORD


algorithm = 'aes-256-ctr',
password = 'd6F3Efeq';

function encrypt(text) {
    var cipher = crypto.createCipher(algorithm, password)
    var crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex');
    return crypted;
}

app.get('/',(req,res)=>{
    res.send('HOME PAGE')
})



///DELIVERIES 



app.get('/deliveries/:driver_id',(req,res)=>{
    let driver_info = req.params.driver_id
    db.showDeliveries(driver_info).then(Element=>{
        res.status(Element.status).send(Element.delivery_info)
    })
})

app.put('/get/price/:driver_id',(req,res)=>{
    let driver_id = req.params.driver_id
    db.calculateSalary(driver_id).then(Element=>{
        if(Element.status === 204){
            db.updateSalary(driver_id,0)
            res.status(204).send(Element.delivery_info)
        }
        else
            {
                let salary = 0
                Element.delivery_info.forEach(element => {
                    salary = salary + element.price
                });
                salary = (5*salary)/100
                db.updateSalary(driver_id,salary)
                res.status(200).send(salary.toString())
            }
    })
})

app.put('/get/estimated/price', ensureToken ,(req,res)=>{
    jwt.verify(req.token,'my_secret_key',(err,data)=>{
        if(err) {
            res.sendStatus(403);
        }
        else{
            var driver_id = data.user.id
            db.calculateEstimatedSalary(driver_id).then(Element=>{
                if(Element.status === 204){
                    db.updateEstimatedSalary(driver_id,0)
                    res.status(204).send(Element.delivery_info)
                    }
                else
                    {
                        let salary = 0
                        Element.delivery_info.forEach(element => {
                            salary = salary + element.price
                        });
                        salary = (5*salary)/100
                        db.updateEstimatedSalary(driver_id,salary)
                        res.status(200).send(salary.toString())
                    }
            })
        }
    })
})


function ensureToken(req,res,next){
    const header = req.headers["authorization"]
    if(typeof header !== 'undefined'){
        const split_header = header.split(" ")
        const headerToken = split_header[1]
        req.token = headerToken
        next()
    }
    else{
        res.sendStatus(403);
    }
}



/// REGISTER - LOGIN - DELETE



app.post('/login',(req,res)=>{
    let driver_info = req.body
    db.login(driver_info.email,encrypt(driver_info.password)).then(Element=>{
        if(Element.length !== 0){
            const user =  {id: Element[0].driver_id}
            const token = jwt.sign({user},'my_secret_key');
            res.send(token)
        }
        else{
            res.send('User or password incorrect')
        }
    })    
})


app.post('/register',(req,res)=>{
    let driver_info = req.body
    const p1 = new Promise((resolve,reject)=>{
        db.addDriver(driver_info.f_name,driver_info.l_name,driver_info.driver_age,driver_info.email).then(Element=>{
            resolve(Element)
        })
    })
    const p2 = new Promise((resolve,reject)=>{
        db.addAuthentication(driver_info.email,encrypt(driver_info.password)).then(Element=>{
            resolve(Element)
        })
    })
    Promise.all([p1,p2]).then(Element=>{
        res.status(Element[0]).send()
    })
})

app.delete('/delete/:id',(req,res)=>{
    var driver_info = req.params.id
    db.deleteDriver(driver_info).then(Element=>{
        if(Element.status === 401){
            res.send(Element.rslt)
        }
        else{
           res.send(Element.rslt)
        }
    })
})



/// EDIT STUFF



/// FIELD
app.put('/edit/:field/:id',(req,res)=>{
    var field = req.params.field
    var driver_id = req.params.id
    var body = req.body
    db.editField(field,driver_id,body).then(Element =>{
        res.send(Element)
    })
})

/// DIRECT DIN URL
app.put('/edit/:field/:id/:new',(req,res)=>{
    var driver_id = req.params.id
    var field = req.params.field
    var body = req.params.new
    db.editFieldd(field,driver_id,body).then(Element=>{
        res.send(Element)
    })
})

app.put('/reset/password/:id',(req,res)=>{
    var driver_id = req.params.id
    var new_pass = req.body.new_password 
    db.resetPass(driver_id,encrypt(new_pass))
    res.status(200).send('Password updated!')
})

//just test
app.listen(3030,()=>{
    console.log('Connecting to 3030...')
})