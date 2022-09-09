const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const jwtSecret = process.env.JWT_SECRET;

const getAllMovies = async (req, res) => {
    const movies = await prisma.movie.findMany();

    res.json({ data: movies });
};

const createMovie = async (req, res) => {
    const { title, description, runtimeMins } = req.body;

    const [_, token] = req.get('Authorization').split(' ');
    
        console.log('body', req.body)
        // console.log('title', title)
        // console.log('description', description)
        // console.log(runtimeMins)
        // console.log(_)
        console.log('auth?', req.get('Authorization'))
        console.log('token', token)

    try {
        // todo verify the token
        const decoded = jwt.verify(token, jwtSecret)
    } catch (e) {
        console.log('error', e.message)
        return res.status(401).json({ error: 'Invalid token provided.' })
    }

    try {

        const createdMovie = await prisma.movie.create({
            data: {
                title: title,
                description: description,
                runtimeMins: runtimeMins
            },
        });
        console.log("new movie", createdMovie)
        return res.status(201).json({ data: createdMovie})
    } catch (e) {
        return res.status(401).json({ error: e.message })
    }

};

module.exports = {
    getAllMovies,
    createMovie
};