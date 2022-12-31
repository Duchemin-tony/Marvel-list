const express = require('express')
const path = require('path')
const fetch = require('node-fetch')
const { engine } = require('express-handlebars')
const crypto = require('crypto');

const PORT = process.env.PORT || 5003

const app = express()

let tskey = "1";
let apikey = "1b04417e771e0c750cc451a75677f17f"
let privatekey = "11119f6b85d4961d4407bbb84bffc070"

const getAllCharacters = async () => {
    try {
        const res = await fetch('https://gateway.marvel.com:443/v1/public/characters?ts=' + tskey + '&apikey=' + apikey + '&hash=' + privatekey + '')
        const json = await res.json()
        return json
    } catch (err) {
        console.error(err);
        throw err;
    }
}

// Middleware
app.use(express.static(path.join(__dirname, 'public')))
app.engine('.hbs', engine({ extname: '.hbs' }))
app.set('view engine', '.hbs')

app.get('/', async (_, res) => {
    try {
        const characters = await getAllCharacters()
        res.render('Home', { characters })
    } catch (err) {
        console.log(err)
    }
})

app.get('/:title', (req, res) => {
    const title = req.params.title
    res.render('profile', { title, content: `Ma page ${title}` })
})

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`))