#include "ofxLoopin/compatible.glsl"
#include "ofxLoopin/vert.glsl"


void main()
{
  srcCoord = texCoord;
  srcCoord = (srcMatrix*vec4(srcCoord.x,srcCoord.y,0,1)).xy;

  vertColour = vec4(1,1,1,1);

  vec4 pos = position;

  gl_Position = modelViewProjectionMatrix * pos;
}
