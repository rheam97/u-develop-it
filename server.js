const mysql = require('mysql2')
const inputCheck = require('./utils/inputCheck')
const express = require('express');
const { result } = require('lodash');
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
    const sql = `SELECT * FROM candidates`
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
    const sql = `SELECT * FROM CANDIDATES WHERE id =?`
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