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

        res.status(200).send({ userDoc, token })
    } catch (e) {
        if (e.code === 11000) return res.status(409).send(e)
        res.status(400).send(e)
    }
})

router.post('/login', async (req, res) => {

    try {
        const userDoc = await UserModel.findByCredentials(req.body.email, req.body.password)
        const token = await userDoc.generateAuthToken()
        res.status(200).send({ userDoc, token })
    } catch (e) {
        res.status(500).send(e)
    }
})

router.post('/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => {
            return token.token !== req.token;
        })
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/logoutall', auth, async (req, res) => {
    try {
        req.user.tokens = []
        req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/me', auth, async (req, res) => {
    res.send(req.user)
})


router.patch('/update', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['username', 'email', 'password']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/delete', auth, async (req, res) => {
    try {
        await req.user.remove()
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/profile/:id', auth, async (req, res) => {

    const id = req.params.id

    try {
        let profileId = req.user.friends.find(userId => {
            return id === userId.toString()
        })

        if (!profileId) throw new Error()
        const userDoc = await UserModel.findOne(profileId)

        res.status(200).send(userDoc)

    } catch (e) {
        res.status(404).send('User is not your friend')
    }

})

router.get('/friends', auth, async (req, res) => {
    try {
        if (req.user.friends === []) throw new Error()

        await req.user.populate({ path: 'friends', select: 'username email' })

        res.status(200).send(req.user.friends)

    } catch (e) {

        res.status(404).send('Cant find friends')

    }

})

module.exports = router