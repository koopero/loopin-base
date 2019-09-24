#!/usr/bin/env node

function init( dst ) {
  const _ = require('lodash')
  const fs = require('fs-extra')
  const pathlib = require('path')
  const yaml = require('js-yaml')
  const resolveSrc = pathlib.resolve.bind( null, __dirname )
  const resolveDst = pathlib.resolve.bind( null, dst )
  const glob = require('glob')


  let copyfiles = fs.readFileSync( resolveSrc( '.copyfiles.yaml' ) )
  copyfiles = yaml.load( copyfiles )

  _.map( copyfiles, file => {
    if ( _.isArray( file ) ) 
      copy( file[0], file[1] )
    else if ( _.isString( file ) ) 
      glob.sync( file, { cwd: resolveSrc() } )
      .map( file => copy( file ) )
  } )

  function copy( src, dst ) {
    dst = dst || src
    src = resolveSrc( src )
    dst = resolveDst( dst )

    console.log( 'copy', src, dst )

    if ( fs.existsSync( dst ) ) 
      return

    fs.ensureFileSync( dst )
    fs.copyFileSync( src, dst )
  }
}


if ( module == require.main )
  init( process.cwd() )

