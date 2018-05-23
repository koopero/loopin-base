#!/bin/sh
':' //; exec "$(command -v nodejs || command -v node)" "$0" "$@"

const config = require('./config')
    , loopin = require('./loopin')
    , server = require('./server')

server.open()
