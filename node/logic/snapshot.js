module.exports = snapshot
const H = require('horten')


function snapshot() {
  const loopin = this
      , opt = {}

  loopin.plugin('save')

  const cursor = new H.Cursor( {
    listening: true,
    path: 'logic/snapshot',
    onValue: v => v && v.snap && snap( v.snap )
  } )

  return cursor

  function filename() {
    const t = new Date().getTime()
        , ext = cursor.get('extension') || '.jpg'
        , prefix = cursor.get('prefix') || 'data/snap/snap.'
        , base = prefix + t.toFixed(0) + ext

    return loopin.filesResolve( base )
  }

  function snap() {
    return loopin.save( cursor.get('buffer'), { dest: filename() } )
      .then( function ( data ) {
        // done
      })
  }
}
