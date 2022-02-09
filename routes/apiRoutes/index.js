const express = require('express')
const router = require('express').Router()

router.use(require('./candidates'))
router.use(require('./parties'))
router.use(require('./voters'))

module.exports= router