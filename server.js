const mysql = require('mysql2')
const inputCheck = require('./utils/inputCheck')
const express = require('express');
const { result } = require('lodash');
const { createSecretKey } = require('crypto');
const PORT = process.env.PORT || 3001
const app = express()
// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'election'
},
console.log('Connected to the election database'))

app.get('/api/candidates', (req, res)=> {
    const sql = `SELECT candidates.*, parties.name 
    AS party_name 
    FROM candidates 
    LEFT JOIN parties 
    ON candidates.party_id = parties.id`
    db.query(sql, (err, rows)=> {
        if(err){
            res.status(500).json({error: err.message})
            return
        }
        res.json({
            message: 'success',
            data: rows
        })
    })
})

app.get('/api/candidates/:id', (req, res)=> {
    const sql = `SELECT candidates.*, parties.name 
    AS party_name 
    FROM candidates 
    LEFT JOIN parties 
    ON candidates.party_id = parties.id 
    WHERE candidates.id = ?`
    const params = req.params.id
    db.query(sql, params, (err, rows)=> {
        if(err){
            res.status(400).json({error:err.message})
            return
        }
        res.json({
            message: 'success',
            data: rows
        })
    })
})

app.delete('/api/candidates/:id', (req, res)=> {
    const sql = `DELETE FROM candidates WHERE id =?`
    const params = [req.params.id]

    db.query(sql, params, (err, result)=> {
        if(err){
            res.statusMessage(400).json({error: res.message})
        }else if(!result.affectedRows){
            res.json({
                message: 'Candidate not found.'
            })
        }
        else{
            res.json({
                message: 'deleted',
                changes: result.affectedRows,
                id: req.params.id
            })
        }
    })
})

app.post(`/api/candidates`, ({body}, res)=> {
    const error = inputCheck(body, 'first_name', 'last_name', 'industry_connected')
    if(error){
        res.status(400).json({error: error})
        return
    }
    const sql = `INSERT INTO candidates(first_name, last_name, industry_connected)
    VALUES (?,?,?)`
    const params = [body.first_name, body.last_name, body.industry_connected]
    db.query(sql, params, (err, result)=> {
        if(err){
            res.status(400).json({error: err.message})
            return
        }
        res.json({
            message: 'succes',
            data: body
        })
    })
})

app.get(`/api/parties`, (req, res)=> {
    const sql = `SELECT * FROM parties`
    db.query(sql, (err, rows)=> {
        if(err){
           res.status(500).json({error: err.message})
           return
        }
        res.json({
            message: "success",
            data: rows
        })
    })
})

app.get(`/api/party/:id`, (req, res)=> {
    const sql = `SELECT * FROM parties WHERE id =?`
    const params = [req.params.id]
    db.query(sql, params, (err, rows)=> {
        if(err){
            res.status(400).json({error: err.message})
            return
        }
        res.json({
        message: "success",
        data: rows
        })
    })
})
app.delete(`/api/party/:id`, (req, res)=> {
    const sql = `DELETE FROM parties WHERE id=?`
    const params = [req.params.id]
    db.query(sql, params, (err, row)=> {
        if(err){
            res.status(400).json({error: err.message})
            return
        }
        else if(!row.affectedRows){
            res.json({message: `Party not found.`})
        }
        else {
            res.json({
                message: "deleted",
                changes: row.affectedRows,
                id: req.params.id
            })
        }
    })
})
// update candidate party 
app.put(`/api/candidates/:id`, (req, res)=> {
    const errors = inputCheck(req.body, 'party_id')
    if(errors){
        res.status(400).json({error: errors})
        return
    }

    const sql = `UPDATE candidates set party_id =? WHERE id =?`
    const params = [req.body.party_id, req.params.id]
    db.query(sql, params, (err, result)=> {
        if(err){
            res.status(400).json({error: err.message})
            return
        }
        else if(!result.affectedRows)
        {
            res.json({message: 'Candidate not found.'})
        }
        else{
            res.json({
                message: 'success',
                data: req.body,
                changes: result.affectedRows
            })
        }
    })
})
// db.query(`SELECT * FROM candidates WHERE id=1`, (err, rows)=> {
//     if(err){
//         console.log(err)
//     }
// console.log(rows)
// })

// // db.query(`DELETE FROM candidates WHERE id =?`, 1, (err, result)=> {
// // if(err){
// //     console.log(err)
// // }

// // console.log(result)
// // })

// const sql = `INSERT INTO candidates(id, first_name, last_name, industry_connected)
// VALUES(?,?,?,?)`
// const params = [1, 'Ronald','Firbank', 1]
// db.query(sql, params, (err, result)=> {
//     if(err){
//     console.log(err)
//     }
//     console.log(result)
// })
app.use((req, res)=> {
    res.status(404).end()
})

app.listen(PORT, ()=> {
    console.log(`Server runnning at port ${PORT}!`)
})