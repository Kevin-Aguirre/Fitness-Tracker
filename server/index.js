require('dotenv').config({ path: '../.env'})
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')

const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

app.use(cors())
app.use(express.json())

mongoose.connect(process.env.URI)
    .then(() => console.log("connected"))
    .catch((e) => console.log(e))
    