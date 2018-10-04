# Loopin Shader Cheat Sheet 

# Base Shader

### .vert
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
### .frag
``` glsl
#include "ofxLoopin/compatible.glsl"
#include "ofxLoopin/frag.glsl"
#include "ofxLoopin/src.glsl"

void main()
{
  OUT = texture(srcSampler, srcCoord);
  OUT *= vertColour;
}
```

# Textures

### Shortcut with include
``` glsl
#include "ofxLoopin/src.glsl"
```

### Expanded
``` glsl
uniform sampler2D srcSampler; // GLSL Sampler
uniform mat4 srcMatrix;   // Matrix to use for texture. 
uniform int srcWidth;   // Pixel width of the texture's buffer.
uniform int srcHeight; //  Pixel height of the texture's buffer.
uniform int srcCols;  // `cols` metadata from the texture's buffer.
uniform int srcRows; //  `rows` metadata from the texture's buffer.
```

For multiple textures, replace `src` with the name of the texture.

# Uniforms

## Buffer

Uniforms for buffer being written to.

``` glsl
#include "ofxLoopin/buffer.glsl"
```

``` glsl
uniform float bufferAspect;
uniform int bufferWidth;
uniform int bufferHeight;
uniform int bufferRows;
uniform int bufferCols;
```

## Clock

``` glsl
#include "ofxLoopin/clock.glsl"
```

``` glsl
// Local clock
uniform int clockIndex;   // Integer frame count
uniform float clockTime;  // Number of seconds since clock reset
uniform float clockDelta; // Number of seconds elapsed since the last frame.

// Global clock
uniform int clockGlobalIndex;   // Integer frame count
uniform float clockGlobalTime;  // Number of seconds since clock reset
uniform float clockGlobalDelta; // Number of seconds elapsed since the last frame.
```

## Mesh

Metadata from mesh generators.

``` glsl
#include "ofxLoopin/mesh.glsl"
```

``` glsl
uniform float meshAspect;
uniform int meshCount;
uniform int meshRows;
uniform int meshCols;
```


## Pass

Uniforms for multi-pass rendering.

``` glsl
#include "ofxLoopin/pass.glsl"
```

``` glsl
uniform int passIndex; // Integer index of pass
uniform int passTotal; // Total passes
uniform float passDensity; // 1.0 / passTotal
uniform float passX; // passIndex / passTotal
```

