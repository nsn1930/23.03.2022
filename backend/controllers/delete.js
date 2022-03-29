import express from 'express'
import { readFile, writeFile } from 'fs'
import { database } from '../config/index.js'

const router = express.Router()

router.delete('/delete-todo/:id', (req, res) => {
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


router.delete('/mass-delete', (req, res) => {
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

export default router