import express from 'express'
import { readFile } from 'fs'
import { database } from '../config/index.js'

const router = express.Router()

router.get('/', (req, res) => {

    readFile(database, 'utf-8', (err, data) => {
        if (err) {
            res.json({ status: 'failed', message: 'Failed to read file' })
        } else {
            data = JSON.parse(data)
            res.json({ status: "success", data })
        }
    })
})
router.get('/:id', (req, res) => {

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

export default router