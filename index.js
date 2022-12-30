const express = require('express')
const path = require('path')
const { engine } = require('express-handlebars')

const PORT = process.env.PORT || 5003

const app = express()

// Middleware
app.use(express.static(path.join(__dirname, 'public')))

app.engine('handlebars', engine())
app.set('view engine', 'handlebars')

app.get('/', (_, res) => res.render('home'))

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`))