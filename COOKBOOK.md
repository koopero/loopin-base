# Loopin Cookbook



## Take Control
```` yaml
# Kitchen Sink Slider
``` control
path: loopin/render/example/float/amount
type: float
min: 0
max: 1
pow: 1
digits: 3
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
````

## Kitchen Sink Render
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

## Define Buffer Target

``` yaml
# Setup target buffer.
buffer/example:
  # Defaults to size of current window.
  width: 1920
  height: 1080
  # Options: rgba,rgb[,rgba32 on desktop]
  format: rgba
  depth: false
```

## Kitchen Sink Shader

Shaders should be defined in files, not presets. Default convention is `shader/name.vert` and `shader/name.frag`. 

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
  srcCoord = texcoord;
  vertColour = color;
  vertColour = normal;
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

# Use with point sprites
mesh/example_scatter:
  aspect: 1
  mode: points
  arc:
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



## Window

``` yaml
window:
  width: 1920
  height: 1080
  fullscreen: false
  title: Title to show in window chrome.
```

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

## Minimum Default Shader
``` glsl
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
#include "ofxLoopin/compatible.glsl"
#include "ofxLoopin/frag.glsl"

void main()
{
  OUT = srcCoord.xy;
}
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

## Pixel Gradients

The `pixels` operator, when used in combination with `filter: linear`, allows somewhat smooth, very cheap and flexible gradients. 

``` yaml
pixels/example_hex2:
  format: rgba
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
  channels: rgb
```

```` yaml
# control/gradient.md

``` control
path: loopin/pixels/gradient/data
format: hex
channels: rgb
cols: 6
rows: 1
```
````

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
