'use strict'

const debug = require('debug')('thingsverse:api:routes')
const express = require('express')
const db = require('thingsverse-db')
const asyncify = require('express-asyncify')

const config = require('./config')

const AgentNotFoundError = require('./errors/agent-not-found-error')

const api = asyncify(express.Router())
let services

api.use('*', async (req, res, next) => {
  debug('Connecting to database')
  try {
    if (!services) {
      services = await db(config.db)
    }
  } catch (err) {
    return next(err)
  }
  next()
})

api.get('/agents', async (req, res, next) => {
  try {
    debug('A request has come to /agents')
    const agents = await services.Agent.findConnected()
    res.send(agents)
  } catch (err) {
    return next(err)
  }
})

api.get('/agents/:uuid', (req, res, next) => {
  const { uuid } = req.params
  if (uuid !== 'yyy') {
    return next(new AgentNotFoundError(uuid))
  }
  res.send({ uuid })
})

api.get('/metrics/:uuid', (req, res) => {
  const { uuid } = req.params
  res.send({ uuid })
})

api.get('/metrics/:uuid/:type', (req, res) => {
  const { uuid, type } = req.params
  res.send({ uuid, type })
})

module.exports = api
