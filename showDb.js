const Datastore = require('nedb')

const streets = new Datastore({ filename: 'db/streets.db', autoload: true })
const houses = new Datastore({ filename: 'db/houses.db', autoload: true })

streets.find({}).sort({ name: 1 }).exec((err, list) => {
    list.forEach(street => {
        houses.find({ streetId: street._id }).sort({ number: 1 }).exec((err, hs) => {
            console.log(street.name + ': ' + hs.map(h => h.number + ' (' + h.description + ')').join(', '))
        })
    })
})
