uniform vec2 uNearFar;
uniform float uVolume;
varying vec2 vUv;
varying vec3 vPos;

float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

void main() {

    float fogMin = 0.00;    
    float fogMax = 0.97;
    float near = uNearFar.x;
    float far  = uNearFar.y;
    float intensity = clamp((vPos.y - near) / (far - near), fogMin, fogMax);

    // Shader grid by https://madebyevan.com/shaders/grid/
    vec2 coord = vUv * vec2(27., 62.) * 2.;
     // Compute anti-aliased world-space grid lines
    vec2 grid = abs(fract(coord - 0.5) - 0.5) / fwidth(coord) / 1.5;
    float line = min(grid.x, grid.y);
    line = min(line, 1.0) ;
    line = smoothstep(0.99, 1., line);

    vec3 col = mix(vec3(1, 0.5, 0.75), gl_FragColor.rgb, line);
    vec3 tiles = (1. - col) * (vec3(0.097,0.002,1.000) * .1);
    col += tiles;

    // Fog
    vec3 fogColor = vec3(0.097,0.002,1.000) * .1;
    float nz = map(vPos.z, -50., 50., 0., 1.);
    float fogMask = 1. - smoothstep(0., 0.55 ,nz);
    vec3 finalColor = mix(col, fogColor, fogMask);
    gl_FragColor = vec4(finalColor, 1.);

}