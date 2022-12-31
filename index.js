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
    const res = await fetch('https://gateway.marvel.com:443/v1/public/characters?series=24229&orderBy=name&limit=50?&ts=' + tskey + '&apikey=' + apikey + '&hash=' + privatekey + '')
    //console.log(res)
    const json = await res.json()
    return json
})

const getCharacter = catchErrors(async (characterID) => {
    const url = `https://gateway.marvel.com:443/v1/public/characters/${characterID}?&ts=${tskey}&apikey=${apikey}&hash=${privatekey}`;
    console.log(url)
    const res = await fetch(url);
    const json = await res.json();
    return json;
})


// Middleware
app.use(express.static(path.join(__dirname, 'public')))
app.engine('.hbs', engine({ extname: '.hbs' }))
app.set('view engine', '.hbs')

app.get('/', catchErrors(async (_, res) => {
        const characters = await getAllCharacters()
        res.render('Home', { characters })
}))

app.get('/notFound', (_, res) => res.render('notFound'))

app.get('/:character', catchErrors(async (req, res) => {
    const search = req.params.character
    const characters = await getAllCharacters();
    const characterData = characters.data.results.find(c => c.name.toLowerCase() === search.toLowerCase());
    if (!characterData) {
        // personnage non trouvé, on va gérer l'erreur ici
        res.redirect('notFound')
    }
    const characterId = characterData.id;
    const character = await getCharacter(characterId)
    res.render('profile', {
        character, name: characterData.name,
        image: characterData.thumbnail.path + '.' + characterData.thumbnail.extension,
        description: characterData.description
    })
}))

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`))