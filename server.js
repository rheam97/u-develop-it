const express = require('express');
const apiRoutes = require('./routes/apiRoutes')
const db = require('./db/connection')

const { result } = require('lodash');
const { createSecretKey } = require('crypto');

const PORT = process.env.PORT || 3001
const app = express()

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/api', apiRoutes)




app.use((req, res)=> {
    res.status(404).end()
})


db.connect(err=> {
    if(err) throw err
    console.log('Database connected.')
    app.listen(PORT, ()=> {
        console.log(`Server runnning at port ${PORT}!`)
    })

})