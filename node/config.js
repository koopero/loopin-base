// This is a shim for the `config` module, which ensures that config
// files are sought in the proper directory.
const path = require('path')
process.env.NODE_CONFIG_DIR = path.resolve( __dirname, '..', 'config')
module.exports = require('config')
