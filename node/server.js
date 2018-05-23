const config = require('config')
    , loopin = require('./loopin')
    , server = loopin.plugin(
        require('loopin-server'),
        config.get('server')
      )

server.hortenServer.on('openExpress', function ( app ) {
  // This is where to add your own express routes.
} )

module.exports = server

if ( module == require.main )
  server.open()
