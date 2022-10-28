#define tri(t, scale, shift) ( abs(t * 2. - 1.) - shift ) * (scale)

uniform float uTime;
uniform float uVolume;
varying vec2 vUv;

float smin( float a, float b, float k )
{
    float h = clamp( 0.5+0.5*(b-a)/k, 0.0, 1.0 );
    return mix( b, a, h ) - k*h*(1.0-h);
}

void main()
{
    float dist = length(vUv - vec2(0.5,0.5));
    float divisions = 5.;
    float divisionsShift= 0.4;
	
    float pattern = tri(fract(( vUv.y + uTime * 0.006 + 0.5)* 20.0), 3.0/  divisions, divisionsShift)- (-vUv.y + 0.26) * 0.85;

    float sunOutline = smoothstep( 0.0,-0.015, max( dist - 0.51, -pattern)) ;
   
    vec3 c = sunOutline * mix(vec3( 4.0, 0.0, 0.2), vec3(1.0, 1.1, 0.0), vUv.y);  
    
    // glow 
    float glow = max(0.0, 1.0 - dist * 1.25);
    glow = min(glow * glow * glow, 0.325);
    c += glow * vec3(1.5, 0.3, (sin(uVolume * 0.03 )+ 1.0)) * 1.1;
   
    gl_FragColor = vec4(c,1.);
}