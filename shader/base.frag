#version 150
/*
  This is a copy of ofxLoopin's default GLSL fragment shader, with the
  addition of a fairly complete list of default uniforms.

  To create your own shader, duplicate this file within the
  'shader/' directory with the extension '.frag'
*/

/*
  Inputs supplied by vertex shader by loopin convention.
*/
in vec2 srcCoord;
in vec4 vertColour;

/*
  Default output.
*/
out vec4 outputColour;

/*
  Texture
  Since the default texture is named `src`, this is used as the prefix.
*/
uniform sampler2D srcSampler; // GLSL Sampler
uniform mat4 srcMatrix;   // Matrix to use for texture. Currently unity.
uniform int srcWidth;   // Pixel width of the texture's buffer.
uniform int srcHeight; //  Pixel height of the texture's buffer.
uniform int srcCols;  // `cols` metadata from the texture's buffer.
uniform int srcRows; //  `rows` metadata from the texture's buffer.

/*
  Clock
*/
// Global clock
uniform int clockGlobalIndex;   // Integer frame count
uniform float clockGlobalTime;  // Number of seconds since clock reset
uniform float clockGlobalDelta; // Number of seconds elapsed since the last frame.

// Local clock
uniform int clockIndex;   // Integer frame count
uniform float clockTime;  // Number of seconds since clock reset
uniform float clockDelta; // Number of seconds elapsed since the last frame.

/*
  Render multi-pass.
*/
uniform int passIndex; // Integer index of pass
uniform int passTotal; // Total passes
uniform float passDensity; // 1.0 / passTotal
uniform float passX; // passIndex / passTotal

/*
  Target buffer
*/
uniform float bufferAspect;
uniform int bufferWidth;
uniform int bufferHeight;
uniform int bufferRows;
uniform int bufferCols;

/*
  Mesh metadata.
*/
uniform float meshAspect;
uniform int meshCount;
uniform int meshRows;
uniform int meshCols;

/*
  The default shader is pretty simple...
*/
void main()
{
  outputColour = texture(srcSampler, srcCoord);
  outputColour *= vertColour;
}
