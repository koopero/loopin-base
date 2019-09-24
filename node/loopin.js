const _ = require('lodash')
module.exports = function loopin( config ) {
  const loopin = module.exports = require('loopin').global()

  // Resolve to project root
  const resolve = require('path').resolve.bind( null, config.root )
  loopin.plugin('files')
  loopin.filesRoot( resolve() )

  // Include the interface between loopin and horten
  loopin.plugin('horten','loopin/')

  // Load and watch all presets from the directory ./preset
  loopin.plugin('presetDir')
  loopin.presetDir( { autoload: true } )

  // Load and watch all shaders in the directory ./shader
  loopin.plugin( require('loopin-shaders'), {
    
  })

  // Load and watch all images in the directory ./image
  // Note that due to some bugs in the file watching
  // system, modified images may not be automatically
  // reloaded. If images aren't loaded at runtime,
  // restart the application.
  loopin.plugin('imageDir', { watch: true, autoload: true } )

  // Include useful examples of higher-level logic.
  loopin.plugin( require('./logic/snapshot' ) )
  loopin.plugin( require('./logic/recorder' ) )


  // If trace all patches to loopin
  if ( _.get( config, 'debug.verbose' ) )
    loopin.logShow('patch')

  // Load the loopin-native module
  loopin.plugin( require('loopin-native'), {
    useEnv: true,
    verbose: _.get( config, 'debug.verbose' ),
  } )

  const server = loopin.plugin( require('loopin-server'), config['server'] || {} )
  server.hortenServer.on('openExpress', function ( app ) {
    // This is where to add your own express routes.
  } )
  server.open()

  return loopin.bootstrap()
  .then( function () {
    // Loopin is sucessfully booted!
    return loopin
  })
}