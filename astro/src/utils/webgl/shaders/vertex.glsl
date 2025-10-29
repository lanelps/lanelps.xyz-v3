#version 300 es

in vec2 position;
uniform mat4 u_projection;
out vec2 v_texcoord;

void main() {
    v_texcoord = position * 0.5 + 0.5;
    vec4 pos = vec4(position, 0.0, 1.0);
    gl_Position = u_projection * pos;
}