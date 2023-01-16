const mongoose = require('mongoose')

function connectDb() {
    mongoose.connect('mongodb://127.0.0.1:27017/test_db')
    const db = mongoose.connection
    db.on('error', console.error.bind(console, "Failed to connect"))
    db.on('open', () => console.log('DB connected.'))
}

module.exports = connectDb