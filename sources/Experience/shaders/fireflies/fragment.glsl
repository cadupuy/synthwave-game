
void main()
{
    float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
    float circle = step(distanceToCenter, 0.5);

    if (circle == 0.) {
        discard;
    }


    gl_FragColor = vec4(vec3(circle), 1.);
}