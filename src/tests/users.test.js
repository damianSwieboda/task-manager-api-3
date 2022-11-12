const request = require('supertest')
const User = require('../models/users')
const { app }= require('../app')
const { setupDatabase, userOne, userOneId, } = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should sing up new user', async ()=>{
    const response = await request(app).post('/users').send({
            name:"Jack",
            email:"jack@xyz.com",
            password: "XyZ123!@#"
        }).expect(201)
    
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    expect(response.body).toMatchObject({
        user:{
            name:"Jack",
            email:"jack@xyz.com",
        },
        token: user.tokens[0].token
    })

    expect(user.password).not.toBe("XyZ123!@#")
})

test('Should not allow to create user with bad credentials - email, or password', async ()=>{
    await request(app).post('/users').send({
        name: 'userOne',
        email: 'userOne@email.com',
        password: 'userPassword123#',
    }).expect(400)

    await request(app).post('/users').send({
        name: 'userOne',
        email: 'unique@email.com',
        password: '1',
    }).expect(400)

    const users = await User.find()

    expect(users.length).toBe(2)
})

test('Should login user', async ()=>{
    const response = await request(app).post('/login').send({
        email: userOne.email,
        password: userOne.password,
    }).expect(200)

    const user = await User.findById(response.body.user._id)

    expect(response.body.token).toBe(user.tokens[1].token)
})

test('Should not allow to login user because bad email, or password', async ()=>{
    await request(app).post('/login').send({
        email: 'badEmail@email.com',
        password: userOne.password,
    }).expect(400)

    await request(app).post('/login').send({
        email: userOne.email,
        password: 'badpassword',
    }).expect(400)
})

test('Should get user data', async ()=>{
    await request(app).get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get user data, cause lack of authorization', async ()=>{
    await request(app).get('/users/me')
        .send()
        .expect(401)
})

test('Should logout user', async ()=>{
    await request(app)
        .post('/logout')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})


test('Should patch user data', async ()=>{
    const response = await request(app).patch('/users')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name:'changed'
        })
        .expect(200)
    
    const user = await User.findById(response.body._id)
    expect(user.name).toBe(response.body.name)
})


test('Should not upload user data, because provided invalid values', async ()=>{
    await request(app).patch('/users')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: '.' 
        })
        .expect(400)     
})


test('Should delete user', async ()=>{

    const users = await User.find()

    await request(app).delete('/users')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    const usersAfterDelete = await User.find()

    expect(usersAfterDelete.length).toBe(users.length - 1)
})


test('Should upload user avatar', async ()=>{
    await request(app).post('/userAvatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'src/tests/fixtures/profile-pic.jpg')
        .expect(200)
    
    const user = await User.findById(userOne._id)
    expect(user.avatar).toEqual(expect.any(Buffer)) // from stackoverflow
})
