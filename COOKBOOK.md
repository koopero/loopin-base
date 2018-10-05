# The Loopin Cookbook

This file contains a fairly complete documentation of [Loopin](https://github.com/koopero/loopin) features, conventions and techniques as a series of copy-pastable code examples, progressing from most basic to most advanced.

## Contents

- [Security Warning](#security-warning)
- [Language Prerequisites](#language-prerequisites)
- [Starting a Project](#starting-a-project)
- [Working on a Project](#working-on-a-project)
- [A Simple Preset](#a-simple-preset)
- [A Simple Shader](#a-simple-shader)
- [Take Control](#take-control)
- [Define Buffer Target](#define-buffer-target)
- [Kitchen Sink Render](#kitchen-sink-render)
- [Kitchen Sink Shader](#kitchen-sink-shader)
- [Setting the Clock](#setting-the-clock)
- [Mesh Generators](#mesh-generators)
- [Window](#window)
- [Show a Buffer in the Window](#show-a-buffer-in-the-window)
- [Orbit Camera](#orbit-camera)
- [2D Transformation](#2d-transformation)
- [Make a texture](#make-a-texture)
- [The `src` Texture](#the-src-texture)
- [Include Shader Libraries](#include-shader-libraries)
- [Load an Image](#load-an-image)
- [Save an Image](#save-an-image)
- [Solid Colours](#solid-colours)
- [Checkerboard Pattern](#checkerboard-pattern)
- [Pixel Gradients](#pixel-gradients)
- [Multi-pass Rendering](#multi-pass-rendering)
- [Direct Mesh Editing](#direct-mesh-editing)
- [Syphon Input and Output](#syphon-input-and-output)
- [Connect a Kinect](#connect-a-kinect)
- [Double Buffering / Sweet Feedback Loops](#double-buffering--sweet-feedback-loops)
- [Advanced Image Loading](#advanced-image-loading)
- [Detailed Shader Setup](#detailed-shader-setup)
- [Detailed Project Layout](#detailed-project-layout)
- [Web Endpoints](#web-endpoints)
- [Controlling Javascript](#controlling-javascript)
- [Sending Pixels to Javascript](#sending-pixels-to-javascript)
- [Credits](#credits)


## Security Warning
The Loopin system intentionally creates a very promiscuous, completely unsecured local web server while running. This server should not be exposed to open web, nor run in an environment where hooliganism is a possibility. For production applications, security *MUST* be implemented at the network layer.

## Language Prerequisites

Knowledge of the following languages, or a willingness to learn, should be considered prerequisite to Loopin use:

- **GLSL** : Shader code. This is where the magic happens.
- **YAML** : Patches and presets, controlling the structure of Loopin applications.
- **Markdown** : Control configuration and documentation.  
- **node.js** : Project boilerplate and higher level logic.

This document contains examples in all of these language. Many examples will have example filenames as their first line. Examples written in YAML are assumed to be Loopin presets.

## Starting a Project

``` sh
git clone https://github.com/koopero/loopin-base.git YOURPROJECT
cd YOURPROJECT
# Set your project name, repositories, etc here.
npm init 
npm install
npm start
```

Once the project is running, point your browser at [http://localhost:7004](http://localhost:7004/). This will show combined controls and documentation for the project.

When deploying on Linux, working on many Loopin projects or developing the Loopin system, see additional documentation in [loopin-native](https://github.com/koopero/loopin-native).

To quit a running project, use `ctrl-c` in the terminal window.

## Working on a Project

The project should be kept running throughout developement. Starting and stopping is not required, except for changes to server config. Most Loopin development consists of editing **preset**, **shader** and **control** files and using **web controls** to tune and manipulate project settings. Project state is persisted automatically.


Important files are as follows:

- `preset/*.yaml` Define rendering skeleton and setup.
- `shader/*.(frag|vert)` Autoloaded shaders. To create a new shader, duplicate `shader/base.vert` and/or `shader/base.vert` with a new name.
- `control/*.md` Project controls.
- `image/*.(png|jpg)` Autoload images to buffers.
- `config/default.yaml` Server and controls setup. Project must be restarted when changed.

## A Simple Preset

``` yaml
# preset/example.yaml

# Set window size.
window:
  width: 1280
  height: 1024

# Render something!
render/example_output:
  src: rgb
  shader: example_shader

# Choose which buffer to show.
# Remove this line once you have show/buffer in controls.
show/buffer: example_output

# Solid image as example input
pixels/rgb:
  format: hex2
  data: f00 0f0 00f

# Disable on-screen display
osd/enable: false
```


## A Simple Shader

A good portion of Loopin development is the creation and tuning of shaders.

Shaders are auto-loaded and watched from `shader/*.(glsl|frag|vert)`.

Here is the default shader, including compatibility shim to work on OpenGL 3.2 and ES.

``` glsl
// shader/example.vert

#include "ofxLoopin/compatible.glsl"
#include "ofxLoopin/vert.glsl"

void main()
{
  srcCoord = texcoord;
  vertColour = vec4(1,1,1,1);

  vec4 pos = position;
  gl_Position = modelViewProjectionMatrix * pos;
}
```
``` glsl
// shader/example.frag

#include "ofxLoopin/compatible.glsl"
#include "ofxLoopin/frag.glsl"
#include "ofxLoopin/src.glsl"

void main()
{
  OUT = Texture(srcSampler, srcCoord);
  OUT *= vertColour;
}
```

## Take Control

Loopin controls are defined in Markdown files in `control/*.md`. These files are mostly standard Markdown, with the intention of combining project documentation and control.

The actual controls are defined in YAML using codeblock elements with the language `control`.

All paths defined in Loopin presets may be controlled. The prefix `loopin/` is used in controls to allow controls outside the `ofxLoopin` runtime.

The most useful types of control are `float` ( slider ) and `options`.

```` yaml
# control/index.md

# Kitchen Sink Slider
``` control
path: loopin/render/example/float/amount
type: float
min: 0
max: 1
pow: 1
digits: 3
unit: ''
metric: false
```

# Options
``` control
path: loopin/render/example/texture/src/buffer
options:
  - example_input_0
  - example_input_1
  - example_input_1
```

# Nested controls
``` control
path: loopin/render/example/float
subs:
  example_uniform:
    type: float
  
  another_uniform:
    options:
      - 1.0
      - 2.0
      - 3.0
```
````

## Define Buffer Target

Buffers are automatically created by all operators, but it is useful to define them in presets

``` yaml
# Setup target buffer.
buffer/example:
  # Defaults to size of current window.
  width: 1920
  height: 1080

  # Options: rgba,rgb[,rgba32 on desktop]
  format: rgba

  # Needed for depth testing.
  depth: false

  # Not used internally, but sent to shaders as metadata.
  cols: 1
  rows: 1
```

Uniforms for current buffer are available to shaders.

``` glsl
#include "ofxLoopin/buffer.glsl"
```

``` glsl
// Expanded from `ofxLoopin/buffer.glsl`
uniform float bufferAspect;
uniform int bufferWidth;
uniform int bufferHeight;
uniform int bufferRows;
uniform int bufferCols;
```

## Kitchen Sink Render

Here is a complete `render` operator, with all properties.

``` yaml
# This is where the magic happens.
render/example:
  # Render buffer defaults to name 
  buffer: example

  # References to high level objects.
  mesh: example_mesh
  shader: example_shader
  camera: example_camera

  # 2D transformation
  transform:
    mode: cover
    x: 0
    y: 0
    aspect: 1
    scale: 1
    rotate: 0

  # Each layer has it's own asynchronous clock.
  clock:
    mode: time
    rate: 60
    speed: 1

  # Options: none,alpha,add,subtract,multiply,screen
  blend: none

  # Test depth?
  depth: false

  # Options: true,false,none,rgba,depth,both
  clear: none

  # Flip double buffer on render.
  advance: false

  # Options: front,back,both
  face: both 

  # Enable multipass rendering,
  # or disable rendering.
  passes: 1

  # Textures
  texture:
    # src is the default texture
    src:
      buffer: example_input
      filter: nearest
      wrap: wrap

    # Another texture, buffer shorthand.
    # Available in shader as 
    # uniform sampler2D anotherSampler
    another: example_other_input 

  # Layers.
  # Instances of Render that run in alphabetical
  # order after main rendering. 
  layer:
    05_foreground:
      src: example_foreground

  # Shorthand using paths.
  layer/10_titles:
    shader: example_titles

  # Uniforms. 
  # Define these in controls, not here!
  float/amount: 1.0
  vec4/foo:
    x: 0
    y: 0
    z: 0
    w: 1
```

## Kitchen Sink Shader

``` glsl
// shader/example.vert

#include "ofxLoopin/compatible.glsl"
#include "ofxLoopin/vert.glsl"
#include "ofxLoopin/src.glsl"
#include "ofxLoopin/clock.glsl"
#include "ofxLoopin/pass.glsl"
#include "ofxLoopin/mesh.glsl"

void main()
{
  // From mesh
  vec4 pos = position;
  srcCoord = texcoord;
  vertColour = color;
  vertColour = normal;
  vertColour = vec4(1,1,1,1);

  gl_Position = modelViewProjectionMatrix * pos;
}
```

``` glsl
// shader/example.frag

#include "ofxLoopin/compatible.glsl"
#include "ofxLoopin/frag.glsl"
#include "ofxLoopin/src.glsl"
#include "ofxLoopin/clock.glsl"
#include "ofxLoopin/pass.glsl"
#include "ofxLoopin/mesh.glsl"

// Texture other than 'src'
uniform sampler2D nameSampler;
uniform mat4 nameMatrix;
uniform int nameWidth;
uniform int nameHeight;
uniform int nameCols;
uniform int nameRows;

void main()
{
  OUT = Texture(srcSampler, srcCoord);
  OUT *= vertColour;
}
```

## Setting the Clock

``` yaml
# Global clock setup in root
clock:
  time: 0 
  speed: 1

  # Options: time,frame,stop,step,wall
  mode: time

  # Ignored when mode==time
  rate: 60

# Render / layer clocks are slaved to parent.
render/example:
  clock:
    speed: 0.5

  layer/example_layer:
    # layer clock will be 1/4 speed.
    clock/speed: 0.5
```

### Clock Controls

```` yaml 
# control/clock.md

Set global clock.

``` control
path: loopin/clock
subs: 
  speed: 
    type: float
    min: 0.1
    max: 2

  # Reset clock to time = 0 
  reset:
    type: trigger

  # Advance one frame when mode == step
  advance:
    type: trigger
```

Set layer clock speed.

``` control
path: loopin/render/example/clock/speed
type: float
min: 0.1
max: 2
```
````

### Clock Uniforms

Available in all shaders.


``` glsl
#include "ofxLoopin/clock.glsl"
```

``` glsl
// Expanded from `ofxLoopin/clock.glsl`

// Local clock
uniform int clockIndex;   // Integer frame count
uniform float clockTime;  // Number of seconds since clock reset
uniform float clockDelta; // Number of seconds elapsed since the last frame.

// Global clock
uniform int clockGlobalIndex;   // Integer frame count
uniform float clockGlobalTime;  // Number of seconds since clock reset
uniform float clockGlobalDelta; // Number of seconds elapsed since the last frame.
```


## Mesh Generators
``` yaml
# Default generator is a quad using plane.
mesh/example_plane:
  aspect: 1
  plane:
    # 
    count: 1
    # Density
    cols: 1
    rows: 1
    # Duplicate corner vertices.
    split: false
    # Makes cool diamond pattern.
    weave: true

# Arc is general case for: 
# polygons, circles, pie slices, 
# donuts, etc.
mesh/example_arc:
  aspect: 1
  arc:
    count: 1
    cols: 64
    rows: 8
    rotate: 0
    radius: 1
    span: 360
    inner: 0.0
    split: false

# Simple cube.
mesh/example_cube:
  aspect: 1
  cube:
    count: 1

# Use scatter with point sprites
mesh/example_scatter:
  aspect: 1
  mode: points
  scatter:
    count: 1
    seed: -1

# Spheres. 
mesh/example_sphere:
  aspect: 1
  sphere:
    count: 1
    radius: 1
    cols: 16
    rows: 32
    split: false
```

### Mesh Generator Uniforms

``` glsl
#include "ofxLoopin/mesh.glsl"
```

``` glsl
// Expanded from `ofxLoopin/mesh.glsl`
uniform float meshAspect;
uniform int meshCount;
uniform int meshRows;
uniform int meshCols;
```

## Window

``` yaml
window:
  width: 1920
  height: 1080
  fullscreen: false
  title: Title to show in window chrome.
```

## Show a Buffer in the Window

``` yaml
show:
  buffer: example

  # Options: nearest,linear
  filter: nearest

  # Options: ignore,multiply,divide,show
  alpha: ignore
```

```` yaml
# control/index.md

For convenience, put this at the top of all you controls.

``` control
path: loopin/show
subs:
  buffer:
    options:
      # List all your buffers here.
      - example
      - example_input
  filter:
    options:
      - nearest
      - linear
  
  alpha:
    options:
      - ignore
      - show
      - multiply
      - divide
```
````

## Orbit Camera

``` yaml
# preset/example.yaml

render/example:
  camera: my_camera

camera/my_camera:
  # Remove these from preset if they
  # are setup in controls.
  zoom: 0
  distance: 1
  fov: 32
  dof: 16
  yaw: 0
  pitch: 0
  roll: 0 
```

```` yaml
# control/camera.md

``` control
path: loopin/camera/my_camera
subs:
  pitch:
    type: float
    unit: deg
    min: -90
    max: 90
  yaw:
    type: float
    unit: deg
    min: -180
    max: 180

  roll:
    type: float
    unit: deg
    min: -45
    max: 45

  zoom:
    type: float
    min: -2
    max: 5

  distance:
    type: float
    min: 0
    max: 10
  
  fov:
    type: float
    min: 120
    max: 30
```
````

## 2D Transformation

2D transformation uses the `transform` property of a `render` operator. It is applied after `camera` projection.

``` yaml
render/example:
  transform:
    # options: cover,contain
    mode: cover
    x: 0
    y: 0
    aspect: 1
    scale: 1
    rotate: 0
```

## Make a texture

``` yaml
# preset/example.yaml
render/example:
  texture/name:
    # Any buffer
    buffer: example_input

    # Options: nearest,linear
    filter: nearest
    minFilter: nearest
    magFilter: nearest

    # Options: repeat,clamp[,none on desktop]
    wrap: repeat
    wrapH: repeat
    wrapV: repeat
```

``` glsl
// shader/example.frag
uniform sampler2D nameSampler;
uniform mat4 nameMatrix;
uniform int nameWidth;
uniform int nameHeight;
uniform int nameCols;
uniform int nameRows;
```

### Texture Control

```` yaml
# control/example.md
``` control
path: loopin/render/example/texture/name
subs:
  buffer:
    options:
      - example_input
      - example_foreground
      - etc
  filter:
    options:
      - linear
      - nearest
  
  wrap:
    options:
      - repeat
      - clamp
```
````


## The `src` Texture

``` yaml
render/example:
  # src in an alias to texture/src 
  # Can be used shorthand or expanded.
  src: example_input

```

``` glsl
#include "ofxLoopin/src.glsl"
```

``` glsl
uniform sampler2D srcSampler; // GLSL Sampler
uniform mat4 srcMatrix;   // Matrix to use for texture. 
uniform int srcWidth;   // Pixel width of the texture's buffer.
uniform int srcHeight; //  Pixel height of the texture's buffer.
uniform int srcCols;  // `cols` metadata from the texture's buffer.
uniform int srcRows; //  `rows` metadata from the texture's buffer.
```

For multiple textures, replace `src` with the name of the texture.

## Include Shader Libraries

Using `#include "filename"`, shaders may include external files. It is useful to define commonly used functions in `shader/lib/*.glsl`. Includes work with shader autoloading and watching. Included files will only be included once, even if `#include` is used multiple time, preventing circular dependencies. 

``` glsl
// shader/lib/rotate2D.glsl

vec2 rotate2D(vec2 v, float a) {
  a = a / 180.0 * 3.1415;
  float s = sin(a);
  float c = cos(a);
  mat2 m = mat2(c, -s, s, c);
  return m * v;
}
```

``` glsl
// shader/example_shader.vert

// Boilerplate omitted in example.

#include "lib/rotate2D.glsl"

uniform float angle = 0.0;
void main()
{
  vec4 pos = position;
  pos.xy = rotate2D( pos.xy, angle );
  gl_Position = modelViewProjectionMatrix * pos;
}
```

## Load an Image

The following line in `node/loopin.js` autoloads images from `image/*.(png|jpg)`.
``` js
loopin.plugin('imageDir', { watch: true, autoload: true } )
```
To load images manually.
``` yaml
image/example_image:
  src: image/example_image.png
```

## Save an Image

The base project includes a `snapshot` function to save stills of buffers. To configure it, edit the file `control/utility.md` and add your project's buffers to the snapshot control. See the file `node/logic/snapshot.js` for implementation.

To save an image from javascript:
``` javascript
loopin.plugin('save')
await loopin.save( 'example_buffer', {
  dest: 'data/your_file_name.png',
  format: 'png', // or 'jpg'
})
```

The following preset will save an image, but only when the preset changes, making it less useful.

``` yaml
save/example_save:
  dest: data/example_filename.png
  format: png
```

## Solid Colours

Use the `pixels` operator to define solid colours as buffers.

``` yaml
pixels/darkSlateBlue:
  format: hex
  channels: rgb
  data: 483D8B

# Define unclamped colour ( desktop only! )
pixels/negativeGreen:
  format: float
  channels: rgb
  data: 0 -0.25 0
```

## Checkerboard Pattern

``` yaml
pixels/pattern:
  format: float
  channels: v
  width: 2
  data: 0,1,1,0

render/checkboard:
  src: pattern
  shader: tile
```

``` glsl
// shader/tile.frag
#include "ofxLoopin/compatible.glsl"
#include "ofxLoopin/frag.glsl"
#include "ofxLoopin/src.glsl"

uniform float tiles = 8.0;

void main()
{
  vec2 tiledCoord = srcCoord;
  tiledCoord.xy *= tiles;
  OUT = Texture(srcSampler, tiledCoord);
}
```

## Pixel Gradients

The `pixels` operator, when used in combination with `filter: linear`, allows somewhat smooth, very cheap and flexible gradients. 

``` yaml
# Cheesy rainbow
pixels/example_hex2:
  format: hex2
  channels: rgb
  data: f00 ff 0f0 0ff 00f f0f

render/gradient:
  texture/gradient:
    buffer: example_hex2
    filter: linear
```

To make gradients editable, use the pixels element in both ofxLoopin and horten-control.

``` yaml
# preset/gradient.yaml

pixels/gradient:
  format: hex
  channels: rgba
  # Don't put data: here!
```

```` yaml
# control/gradient.md

``` control
path: loopin/pixels/gradient/data
format: hex
channels: rgba
cols: 6
rows: 1
```
````

## Multi-pass Rendering

``` yaml
buffer/example:
  format: rgba32

render/example:
  passes: 100
  shader: multi_pass
  blend: screen
  src: example_input
```

``` glsl
// shader/multi_pass.frag
#include "ofxLoopin/compatible.glsl"
#include "ofxLoopin/frag.glsl"
#include "ofxLoopin/src.glsl"
#include "ofxLoopin/pass.glsl"

uniform float blurAmount = 0.1;

void main()
{
  vec2 blurredCoord = srcCoord;

  blurredCoord.x += blurAmount * passX;

  OUT = Texture(srcSampler, blurredCoord);
  OUT *= passDensity;
}
```

``` glsl
// Expanded from `ofxLoopin/pass.glsl`

uniform int passIndex; // Integer index of pass
uniform int passTotal; // Total passes
uniform float passDensity; // 1.0 / passTotal
uniform float passX; // passIndex / passTotal
```

## Direct Mesh Editing 

Mesh data may be dynamically edited using the `mode`, `index` and `vertex` properties of `mesh` operators.

``` yaml
# Define the base quad manually.
mesh/manual_quad:
  mode: triangle
  aspect: 0
  index: [ 0, 1, 2, 2, 3, 0 ]
  vertex:
    # incomplete array syntax
    0: [ -1, -1 ]
    1: [  1, -1 ]
    # complete array syntax
    2: [  1,  1, 0, 1, 1, 1, 1, 1, 0, 0, 1 ]
    # object syntax with all properties
    3:
      x: -1
      y: 1
      z: 0
      u: 0
      v: 1
      r: 1
      g: 1
      b: 1
      a: 1
      nx: 0
      ny: 0
      nz: 1
```

```` yaml
# Moving top left corner with a control
``` control
path: loopin/mesh/example_mesh/vertex/0
subs:
  x: 
    type: float
    min: -1
    max: 1
  y: 
    type: float
    min: -1
    max: 1
```
````

## Syphon Input and Output

On OSX systems, [Syphon](http://www.syphon.v002.info/) is supported.

``` yaml
# Your output.
render/output: true

# As Syphon server.
syphon/output:
  mode: server
  name: Output

# As Syphon client.
syphon/input:
  mode: client
  app: Avenue
  name: Composition

# Use buffer other than name.
syphon/syphon_example:
  mode: server
  buffer: output
  name: Named Output
```

## Connect a Kinect

``` yaml
kinect/example_kinect:
  # Options: both,depth,video,alpha
  output: both

  # Options: default,off,green,red,yellow,blinkGreen,blinkYellowGreen
  led: default

  # Changing infrared will cause kinect reset!
  infrared: false

  # Control motor, in degrees.
  tilt: 0
```

## Double Buffering / Sweet Feedback Loops

``` yaml
# preset/feedback_loop_example.yaml

# Double buffering is enabled automatically,
# so nothing needs to be set in buffer.
buffer/feedback_loop_example:
  width: 320
  height: 240

render/feedback_loop_example:
  # This will tell the render node to flip 
  # the double buffer before rendering.
  advance: true

  # Reference to currently rendering buffer
  # works fine.
  texture/feedback:
    buffer: feedback_loop_example

  # Set uniform 'amount'.
  float/amount: 10.88

  # Use src for input to feedback loop, if needed.
  texture/src:
    buffer: whatever

  # Shader below
  shader: feedback_shader
```

``` glsl
// shader/feedback_shader.frag

#include "ofxLoopin/compatible.glsl"
#include "ofxLoopin/src.glsl"
#include "ofxLoopin/frag.glsl"
#include "ofxLoopin/clock.glsl"

uniform sampler2D feedbackSampler;

uniform float amount;

void main() {
  vec4 src = Texture( srcSampler, srcCoord );
  vec4 feedback = Texture( feedbackSampler, srcCoord );
  // Put all the cool stuff here, instead of...
  OUT = mix( feedback, src, clockTime * amount );
}
```

## Advanced Image Loading

``` yaml
# Load two images to different regions of the same buffer.
# Autoloading will not work in this case.
buffer/side_by_side:
  width: 1280
  height: 480

image/left_loader:
  buffer: side_by_side
  src: image/left_image.png
  box: 
    width: 640
    height: 480

image/right_loader:
  buffer: side_by_side
  src: image/right_image.png
  box: 
    x: 640
    width: 640
    height: 480
```

## Detailed Shader Setup

``` yaml
shader/example:
  # Uniforms can be applied to all
  # usage of shader.
  float/uniform_example: 2.3

  # Load shaders from YAML or controls,
  # if you're feeling particularly rambunctious.
  frag: |
    #include "ofxLoopin/compatible.glsl"
    void main()
    {
      OUT.rg = Texture(srcSampler, srcCoord);
      OUT.a = 1.0;
    }
```

## Detailed Project Layout

Most Loopin development happens by editing files in the project directory, especially the files in the `./preset` and `./shader` directories.

### config/
Contains static configuration files, interpreted by the [config](https://www.npmjs.com/package/config) module. Use the file `default.yaml` to configure the server portion of this project, including the http port and control pages. Not autoloaded.

### control/
Contains **Markdown** control files. These are documents which contain simple, inline codes to wire control data to the application. If files are changed, simply reload in the browser.

### data/
Used by the application to store runtime generated data.

### data/persist.yaml
This is the data file which the [loopin-server](https://github.com/koopero/loopin-server) module uses to save application state between runs. Normally, you should not need to edit this file directly.

### image/
Contains `.jpg` and `.png` [images](https://loopin.tech/ofxLoopin-image.html), which will be autoloaded by default.

### node/
Mostly boilerplate code to get everything up and running. `node/loopin.js` contains Loopin setup, with configuration of defaults such as which directories are autoloaded. The file `node/logic/snapshot.js` contains a simple utility to take screenshots of the application, as an example of using javascript logic in Loopin apps.

### preset/
YAML configuration files which are 'patched' to the Loopin system. By default, *all* presets in this directory are autoloaded. 

### shader/
GLSL shaders. To create a new shader, duplicate `shader/base.vert` and/or `shader/base.vert` with a new name.

## Web Endpoints

**Loopin**, when combined with the [loopin-server](https://github.com/koopero/loopin-server) module, is a graphics engine with a webserver built in. Many of its internals are available as RESTful endpoints.

### /loopin/buffer/*

See any image buffer with Loopin by accessing the */loopin/buffer/\** endpoint. For example, `http://localhost:7004/loopin/buffer/example.png` will take a snapshot of the buffer `example` in png format.

### /loopin/read/*

See the entire state of the Loopin engine by examining the `/loopin/read/` endpoint. *Warning: Big mass of JSON!*

You can also read a small subset of the state, such as `/loopin/read/render/example`.

## Controlling Javascript

``` js
// node/loopin.js

// Include logic as plugin.
loopin.plugin( require('./logic/example.js'), { /* options */ } )
```

``` js
// node/logic/example.js

module.exports = function example_plugin ( options ) {
  const loopin = this
  const horten = loopin.horten

  const cursor = new horten.Cursor( {
    path: 'logic/example',
    listening: true,
    onValue
  })

  function onValue( value ) {
    // This will be called when the path logic/example
    // is changed. Value should look like:
    {
      exampleTrigger: 1538692567548, // timestamp from trigger control
      exampleValue: 0.5, // value from slider
    }
  }
}
```

```` yaml
``` control
path: logic/example
subs:
  exampleTrigger:
    type: trigger

  exampleValue:
    type: float
```
````

## Sending Pixels to Javascript

``` js
loopin.patch( {
  buffer: 'ReadFromThisBuffer',
  format: 'base64',
  output: 'always',
  channels: 'brg',
}, 'pixels/yourName')

loopin.dispatchListen( 'pixels', function ( event ) {
    let data = event.data
    let width = data.width // In pixels
    let height = data.height // In pixels
    let pixels = Buffer.from( data.data, 'base64' )

    // Send pixels to your WS2812s!

    // Must return true when using dispatchListen,
    // so as to receive a continuous stream of events.
    return true
  })
}
```

# Credits

[Loopin](https://github.com/koopero/loopin) is the brain-child of Vancouver-based creative technologist [Samm Zuest Cooper](https://github.com/koopero).

Loopin development relies on the patient and enthusiastic support of [HFour Design Studio](http://hfour.ca/).

`ofxLoopin` would not be possible without the incredible [openFrameworks](http://openframeworks.cc/community/) project.

Thank you to the wonderful organizers and community at [Vancouver Creative Technology](https://www.meetup.com/Vancouver-Creative-Technology/) for feedback and encouragement.
