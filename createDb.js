const Datastore = require('nedb')

// дві колекції — два файли бази даних
const streets = new Datastore({ filename: 'db/streets.db', autoload: true })
const houses = new Datastore({ filename: 'db/houses.db', autoload: true })

const data = [
    { name: 'площа Ринок', district: 'Галицький', houses: [
        { number: 4, description: 'Чорна кам\'яниця' },
        { number: 6, description: 'Палац Корнякта' } ] },
    { name: 'вулиця Вірменська', district: 'Галицький', houses: [
        { number: 7, description: 'Вірменський собор' },
        { number: 35, description: 'Кав\'ярня «Дзиґа»' } ] },
    { name: 'вулиця Друкарська', district: 'Галицький', houses: [
        { number: 3, description: 'Житловий будинок' },
        { number: 9, description: 'Житловий будинок' } ] }
]

// очищаємо колекції, щоб при повторному запуску не було дублікатів
streets.remove({}, { multi: true }, () => {
    houses.remove({}, { multi: true }, () => {
        data.forEach(s => {
            streets.insert({ name: s.name, district: s.district }, (err, street) => {
                // будинок зберігає _id своєї вулиці — так колекції пов'язані
                const docs = s.houses.map(h => ({ streetId: street._id, number: h.number, description: h.description }))
                houses.insert(docs, (err, inserted) => {
                    console.log(`Вулиця «${street.name}» (_id: ${street._id}), будинків: ${inserted.length}`)
                })
            })
        })
    })
})
