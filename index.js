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

const catchErrors = asyncFunction => (...args) => asyncFunction(...args).catch(console.error)

const getAllCharacters = catchErrors(async () => {
        const res = await fetch('https://gateway.marvel.com:443/v1/public/characters?orderBy=modified&limit=50?&ts=' + tskey + '&apikey=' + apikey + '&hash=' + privatekey + '')
        console.log(res)
        const json = await res.json()
        return json
})

// Middleware
app.use(express.static(path.join(__dirname, 'public')))
app.engine('.hbs', engine({ extname: '.hbs' }))
app.set('view engine', '.hbs')

app.get('/', catchErrors(async (_, res) => {
        const characters = await getAllCharacters()
        res.render('Home', { characters })
}))

app.get('/:title', (req, res) => {
    const title = req.params.title
    res.render('profile', { title, content: `Ma page ${title}` })
})

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`))