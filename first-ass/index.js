const express = require('express')
const app = express()

app.use(express.json())

app.get('/', function (req, res) {
    console.log(req.url)
    res.send('<h1>Hello Oghenetega!</h1>')
});

// USER DATABASE
const users = []

// REGISTRATION
app.post('/users/register', function(req, res) {
    const { firstName, lastName, password, email } = req.body
    if (!firstName || !lastName || !password || !email ) {
        return res.status(400).json({
            status: 'Fail',
            message: 'Incomplete registration details',
        })
    }
    if (users.find((el) => el.email === email)) {
        return res.status(409).json({
            status: 'Fail',
            message: 'User already exists!'
        })
    }
    users.push(req.body)
    res.status(201).json({
        status: 'Success',
        message: 'You have been registered successfully. Please login with your email and password'
    })
});

// CHECKING
app.get('/users', function(req, res) {
    res.status(200).json(users)
});

// LOGIN
app.post('/users/login', function(req, res){
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).json({
            status: 'Fail',
            message: 'Incomplete login details',
        })
    }
    const user = users.find((el) => el.email === email)
    if (user) {
        if (user.password === password) {
            return res.status(200).json({
                status: 'Success',
                message: 'You have logged in successfully',
                data: user,
            })
        }
        res.status(401).json({
            status: 'Fail',
            message: 'Invalid login details!',
        })
    }
    else {
        res.status(404).json({
        status: 'Failed',
        message: 'User does not exist on our database',
        })
    }
})

// UPDATING NAME AND PASSWORD
app.put('/users/:email', function(req, res){
    const { email } = req.params
    if (req.body.email) {
        return res.status(400).json({
            status: 'Fail',
            message: 'Invalid parameters',
        })
    }
    const user = users.find((el) => el.email === email)
    if (user) {
        const currentUser = { 
            ...user,
            ...req.body,
        }
        const index = users.findIndex((el) => el.email === email)
        users[index] = currentUser;
        res.status(200).json({
            status: 'Success',
            message: `User details have been updated successfully`,
            data: currentUser,
        }) 
    }
    res.status(404).json({
        status: 'Failed',
        message: 'User does not exist on our database',
    })
})

app.listen(5000, () => {
    console.log(`Example app listening at http://localhost:${5000}`);
});