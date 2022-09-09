const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const jwtSecret = process.env.JWT_SECRET;

const register = async (req, res) => {
    const { username, password } = req.body;
    //To do check username and password valid (if statements) if empty, unique etch.
    //if(username) throw new Error("Username already exists")

    
    if(!username || !password) {
        res.status(401).json({error: "invalid input"})
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    try {
        const createdUser = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
            }
        })
        res.status(200).json({ data: createdUser })
    } catch (e) {
        res.status(400).json({error: 'failed to create user'})
    }
    
};

const login = async (req, res) => {
    const { username, password } = req.body;
    console.log(req.body)
    console.log(username)
    console.log(password)

    const foundUser = await prisma.user.findUnique({
        where: {
            username,
        }
    })

    if (!foundUser) {
        return res.status(401).json({ error: 'Invalid username or password.' });
    }
    const passwordsMatch = await bcrypt.compare(password, foundUser.password);

    if (!passwordsMatch) {
        return res.status(401).json({ error: 'Invalid username or password.' });
    }

    const token = jwt.sign({username}, jwtSecret)

    res.json({ data: token });
};

module.exports = {
    register,
    login
};