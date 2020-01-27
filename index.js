#!/usr/bin/env node

exports.config = function ( root ) {
  const _ = require('lodash')
  const fs = require('fs')
  const yaml = require('js-yaml')
  const resolve = require('path').resolve.bind( null, root )

  let configFiles = [ 'loopin.config.yaml', 'loopin.local.yaml' ]
  let config = {}

  function loadConfigFile( file ) {
    file = resolve( file )
    try {
      var data = fs.readFileSync( file, 'utf8' )
      data = yaml.safeLoad( data )
    } catch( err ) {
      // console.error( `loopin-base : Error loading config from '${file}'`)
      return
    }

    config = _.merge( config, data )
  }

  config.root = resolve()
  
  configFiles.map( loadConfigFile )

  return config
}

exports.open = async function startApplicationFromDirectory( root ) {
  const config = exports.config( root )
  const loopin = await require('./node/loopin')( config )
  return loopin
}

if ( module == require.main )
  exports.open( __dirname )

