attribute float aScale;
uniform float uSize;

void main()
{
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.);
    gl_PointSize = uSize * aScale;

}