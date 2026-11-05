const express = require('express')
const Datastore = require('nedb')

const app = express()
const port = process.env.PORT || 3000

const streets = new Datastore({ filename: 'db/streets.db', autoload: true })
const houses = new Datastore({ filename: 'db/houses.db', autoload: true })

app.set('view engine', 'ejs')   // шаблони лежать у папці views

// сторінка 1: список вулиць
app.get('/', (request, response) => {
    streets.find({}).sort({ name: 1 }).exec((err, list) => {
        if (err) {
            console.log(err)
            return response.status(500).send('Помилка бази даних')
        }
        response.render('streets', { streets: list })
    })
})

// сторінка 2: будинки на вибраній вулиці
app.get('/street/:id', (request, response) => {
    streets.findOne({ _id: request.params.id }, (err, street) => {
        if (err) {
            console.log(err)
            return response.status(500).send('Помилка бази даних')
        }
        if (!street) {
            return response.status(404).send('Вулицю не знайдено')
        }
        houses.find({ streetId: street._id }).sort({ number: 1 }).exec((err, list) => {
            if (err) {
                console.log(err)
                return response.status(500).send('Помилка бази даних')
            }
            response.render('houses', { street: street, houses: list })
        })
    })
})

app.listen(port, () => {
    console.log(`Сервер почав прослуховувати порт ${port}…`)
})
