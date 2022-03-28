import { readFile, writeFile } from 'fs'
import express from 'express'
import cors from 'cors'

const app = express()
const database = 'database.json'

app.use(cors())

app.use(express.json())

app.use(express.urlencoded({
    extended: false
}))

app.get('/', (req, res) => {

    readFile(database, 'utf-8', (err, data) => {
        if (err) {
            res.json({ status: 'failed', message: 'Failed to read file' })
        } else {
            data = JSON.parse(data)
            res.json({ status: "success", data })
        }
    })
})
app.get('/:id', (req, res) => {

    let id = req.params.id

    readFile(database, 'utf-8', (err, data) => {
        if (err) {
            res.json({ status: 'failed', message: 'Failed to read file' })
        } else {
            data = JSON.parse(data)

            const jsonId = data.findIndex((el) => el.id == id)


            if (jsonId === -1) {
                res.json({ status: 'failed', message: 'Element not found' })
                return
            }

            res.json({ status: "success", data: data[jsonId] })
        }
    })
})

app.post('/add-todo', (req, res) => {
    let task = req.body.task

    readFile(database, 'utf8', (err, data) => {
        if (err) {
            res.json({ status: 'failed', message: 'Failed to read file' })
            return
        }

        let json = JSON.parse(data)
        let id = json.length > 0 ? json[json.length - 1].id + 1 : 0

        //Alternatyva auksciau pazymetai eilutei
        // if(json.length > 0)
        //     id = json[json.length - 1].id + 1

        json.push({ id, task, done: false })

        writeFile(database, JSON.stringify(json), 'utf8', err => {
            if (err) {
                res.json({ status: 'failed', message: 'Save failed' })
            } else {
                res.json({ status: 'success', message: 'Saved successfully' })
            }
        })

    })
})

app.delete('/delete-todo/:id', (req, res) => {
    let id = req.params.id

    readFile(database, 'utf-8', (err, data) => {
        if (err) {
            res.json({ status: 'failed', message: 'Failed to read file' })
            return
        }
        //Issifruojame json informacija atgal i JS masyva
        const json = JSON.parse(data)

        const jsonId = json.findIndex((el) => el.id == id)


        if (jsonId === -1) {
            res.json({ status: 'failed', message: 'Element not found' })
            return
        }

        json.splice(jsonId, 1)

        let jsonString = JSON.stringify(json)

        writeFile(database, jsonString, 'utf-8', (err) => {
            if (err) {
                res.json({ status: 'failed', message: 'Save failed' })
            } else {
                res.json({ status: 'success', message: 'Removed' })
            }
        })
    })
})


app.delete('/mass-delete', (req, res) => {
    let ids = req.body.ids

    readFile(database, 'utf-8', (err, data) => {
        if (err) {
            res.json({ status: 'failed', message: 'Failed to read file' })
            return
        }

        const json = JSON.parse(data)
        let dataArray = []
        json.forEach((value, index) => {
            if (!ids.includes(value.id.toString())) {
                dataArray.push(value)
            }
        })

        let jsonString = JSON.stringify(dataArray)

        writeFile(database, jsonString, 'utf-8', (err) => {
            if (err) {
                res.json({ status: 'failed', message: 'Save failed' })
            } else {
                res.json({ status: 'success', message: 'Marked successfully deleted' })
            }
        })
    })
})


app.put('/mark-done/:id', (req, res) => {
    let id = req.params.id

    readFile(database, 'utf-8', (err, data) => {
        if (err) {
            res.json({ status: 'failed', message: 'Failed to read file' })
            return
        }

        const json = JSON.parse(data)

        const jsonId = json.findIndex((el) => el.id == id)


        if (jsonId === -1) {
            res.json({ status: 'failed', message: 'Element not found' })
            return
        }

        json[jsonId].done = json[jsonId].done ? false : true

        let jsonString = JSON.stringify(json)

        writeFile(database, jsonString, 'utf-8', (err) => {
            if (err) {
                res.json({ status: 'failed', message: 'Failed to save' })
            } else {
                res.json({ status: 'success', message: 'Objective completed' })
            }
        })
    })
})

app.put('/edit-todo/:id', (req, res) => {
    let id = req.params.id
    let task = req.body.task

    if (task === undefined) {
        res.json({ status: 'failed', message: 'Input empty' })
        return
    }

    readFile(database, 'utf-8', (err, data) => {
        if (err) {
            res.json({ status: 'failed', message: 'Failed to read file' })
            return
        }

        const json = JSON.parse(data)

        const jsonId = json.findIndex((el) => el.id == id)


        if (jsonId === -1) {
            res.json({ status: 'failed', message: 'Element not found' })
            return
        }

        json[jsonId].task = task

        let jsonString = JSON.stringify(json)

        writeFile(database, jsonString, 'utf-8', (err) => {
            if (err) {
                res.json({ status: 'failed', message: 'Failed to save' })
            } else {
                res.json({ status: 'success', message: 'Input updated' })
            }
        })
    })
})



app.listen(5001)