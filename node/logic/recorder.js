module.exports = recorder
const H = require('horten')
    , zeropad = require('zeropad')
    , exec = require('handleshells').exec

function now() {
  return new Date().getTime()
}

function recorder() {
  const loopin = this
      , Promise = loopin.Promise
      , glob = Promise.promisify( require('glob') )
      , fs = Promise.promisifyAll( require('fs') )
      , bootTime = now()

  loopin.plugin('save')

  const path = 'logic/recorder'
      , cursor = new H.Cursor( {
        path
      })
      , startCursor = new H.Cursor( {
        listening: true,
        path: H.path.resolve( path, 'start' ),
        onValue
      } )


  return

  function onValue( v ) {
    if ( v && v > bootTime ) {
      record()
    }
  }

  function record() {
    const rate     = parseFloat(cursor.get('rate')) || 60
        , count    = parseFloat(cursor.get('count')) || 300
        , ext      = '.jpg'
        , buffer   = cursor.get('buffer') || 'output'

    let frame = 0
      , lastFrameTime = 0

    var osdPrevious
      , clockPrevious
      , startTime

    return saveOSD()
    .then( () => preDelay() )
    .then( () => clockInit() )
    .then( () => capture() )
    .then( () => restoreOSD() )

    function saveOSD() {
      return loopin.read('osd/')
      .then( ( data ) => osdPrevious = data )
    }

    function clockInit() {
      return Promise.resolve()
      .then( () => loopin.read('clock/') )
      .then( ( result ) => clockPrevious = result )
      .then( () => {
        loopin.patch({
          mode: 'step',
          rate
        }, '/clock' )
      } )
    }

    function preDelay() {
      let delay = parseFloat( cursor.get('delay') || 0 ) * 1000

      if ( delay > 0 ) {
        loopin.patch( {
          enabled: true,
          text: `recorder - delay ${delay}ms`
        }, 'osd/')

        return Promise.delay( delay )
        .then( () => startTime = now() )
      } else {
        startTime = now()
        return Promise.resolve()
      }
    }

    function restoreOSD() {
      return loopin.patch( osdPrevious, 'osd/' )
    }

    function capture() {
      let t = now()
        , index = zeropad( frame++, 4 )
        , filename = `data/recorder/frames/${buffer}.${startTime}.${index}${ext}`

      lastFrameTime = t

      loopin.patch( {
        enabled: true,
        text: `recorder - frame ${index}`
      }, 'osd/')

      return loopin.save( buffer, { dest: filename, format: 'jpg' } )
      .then( advance )
    }

    function advance() {
      const t = now()

      if ( frame >= count )
        return finalize()

      loopin.patch( true, 'clock/advance' )

      return capture()
    }

    function finalize() {
      const ffInput = loopin.filesAbsolute(`data/recorder/frames/${buffer}.${startTime}.%04d${ext}`)
          , ffOutput = loopin.filesAbsolute(`data/recorder/${buffer}.${startTime}.mp4`)
          , framesGlob = loopin.filesAbsolute(`data/recorder/frames/${buffer}.${startTime}.????${ext}`)
          , rate = 60
          , ffCommand = 'ffmpeg -framerate {{ rate }} -i {{ ffInput }} {{ ffOutput }}'

      loopin.patch( {
        enabled: true,
        text: `recorder - finalizing`
      }, 'osd/')

      loopin.patch( clockPrevious, 'clock/')

      return exec( ffCommand, { ffInput, ffOutput, rate } )
      .then( () => glob( framesGlob ) )
      .map( ( frame ) => fs.unlinkAsync( frame ) )
    }
  }
}
