#version 300 es
precision highp float;

in vec2 v_texcoord;

uniform sampler2D u_texture;
uniform vec2 u_canvasSize;  // Viewport dimensions: [width, height]
uniform vec2 u_textureSize; // Image dimensions: [width, height]
uniform float u_rotation;   // Rotation angle in radians
uniform float u_yOffset;    // Vertical offset to simulate scrolling

out vec4 outColor;

void main() {
    vec2 uv = v_texcoord;

    // Determine if we're in top or bottom half of viewport
    vec2 ndc = (uv * 2.0) - 1.0;
    bool isTopHalf = ndc.y > 0.0;

    // Create mirror effect and apply vertical offset (scrolling)
    if (isTopHalf) {
        uv.y = uv.y - u_yOffset;
    } else {
        uv.y = 1.0 - uv.y - u_yOffset;
    }
    // uv.y = 1.0 - uv.y - u_yOffset;

    // Scaling
    // Use effective canvas size – if rotated 90° swap width/height.
    vec2 effectiveTextureSize = u_textureSize;
    if(u_rotation != 0.0) { // Assuming 90° (Math.PI/2) rotation
    effectiveTextureSize = vec2(u_textureSize.y, u_textureSize.x);
    }

    // Determine the scaling factor for a COVER behavior.
    // This scale factor will ensure that the texture covers the canvas.
    float scaleFactor = max(u_canvasSize.x / effectiveTextureSize.x, u_canvasSize.y / effectiveTextureSize.y);

    // Compute the dimensions of the texture when scaled by scaleFactor.
    vec2 scaledSize = effectiveTextureSize * scaleFactor;

    // In UV space (of the texture) the visible area will cover only a fraction:
    // Calculate the fraction of the scaled texture that corresponds to the canvas.
    vec2 uvScale = u_canvasSize / scaledSize;

    // Only center horizontally:
    float offsetX = (1.0 - uvScale.x) * 0.5;

    // Map the input uv (which spans 0..1 over the canvas) into the cropped cover area.
    vec2 finalUV = vec2(uv.x * uvScale.x + offsetX, uv.y * uvScale.y);

    // Apply rotation if needed
    if (u_rotation != 0.0) {
        vec2 centered = finalUV - 0.5;
        float s = sin(u_rotation);
        float c = cos(u_rotation);
        mat2 rotation = mat2(c, -s, s, c);
        centered = rotation * centered;
        finalUV = centered + 0.5;
    }
    
    // Discard out-of-bounds pixels
    if (finalUV.x < 0.0 || finalUV.x > 1.0 || 
        finalUV.y < 0.0 || finalUV.y > 1.0) {
        discard;
    }
    
    outColor = texture(u_texture, finalUV);
}