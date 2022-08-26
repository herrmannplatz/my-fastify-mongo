#!/usr/bin/env node
require('dotenv').config()

const { sign } = require('jsonwebtoken')

const { JWT_SECRET } = process.env

console.log(sign({ id: 'admin' }, JWT_SECRET))
