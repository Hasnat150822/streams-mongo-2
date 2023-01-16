const express = require('express')
const PORT = 8001
const connectDb = require('./db/connection')
const employeeModel = require('./models/EmployeeModel')
const { Transform } = require('stream')

const app = express()
app.use(express.json())

connectDb()


app.get('/getData', (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*')

    const transformData = new Transform({ objectMode: true })
    transformData.isWritten = false

    transformData._transform = function (chunk, encoding, callback) {
        if (!this.isWritten) {
            this.isWritten = true
            callback(null, '[' + JSON.stringify(chunk))
        } else {
            callback(null, ',' + JSON.stringify(chunk))
        }
    }

    transformData._flush = function (callback) {
        callback(null, ']')
    }

    const employees = employeeModel.find().cursor().pipe(transformData)
    employees.on('data', (chunk) => {

        let canWrite = res.write(chunk)

        if (!canWrite) {
            employees.pause()
            res.once('drain', () => employees.resume())
        }
    })

    employees.on('end', () => {
        res.end()
    })
})

app.listen(PORT, () => console.log('SERVER STARTED ON PORT: ' + PORT))