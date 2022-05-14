const express = require('express');
const router = express.Router()
const auth = require('../middleware/auth')
const UserModel = require('../models/user')

// Registration Router
router.post('/register', async (req, res) => {

    const userDoc = new UserModel(req.body);

    try {

        await userDoc.save()
        const token = await userDoc.generateAuthToken()

        res.status(200).send({userDoc, token})

    } catch (e) {
        console.log(e)
        res.status(400).send(e)

    }
})

router.post('/login', async (req, res) => {

    try {

        const userDoc = await UserModel.findByCredentials(req.body.email, req.body.password)
        const token = await userDoc.generateAuthToken()

        res.status(200).send({user, token})

    } catch (e) {
    
        res.status(500).send(e)

    }
})

router.get('/me', async (req,res) => {
    try {
        const user = await UserModel.find({})
        res.send(user)
    } catch (e) {
        res.status(500).send(e)
    }
})


module.exports = router