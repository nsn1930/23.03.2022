import express from 'express'
import { readFile, writeFile } from 'fs'
import { database } from '../config/index.js'

const router = express.Router()

router.put('/mark-done/:id', (req, res) => {
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

router.put('/edit-todo/:id', (req, res) => {
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

export default router