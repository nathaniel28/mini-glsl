#define ITERATIONS 500
#define DARKNESS 50.

float scale(float v, float lo, float hi) {
    return v*(hi-lo)+lo;
}

float shade(vec2 coord) {
    vec2 z = vec2(0., 0.);
    int i = 0;
    float zx2 = 0., zy2 = 0.;
    for (; i < ITERATIONS && zx2 + zy2 < 4.; i++) {
        zx2 = z.x*z.x;
        zy2 = z.y*z.y;
        z = vec2(zx2 - zy2, 2.*z.x*z.y)+coord;
    }
    return DARKNESS/(float(-i)-DARKNESS)+1.;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord/iResolution.xy;
    
    vec2 center = vec2(-1., 0.)+(iMouse.xy/iResolution.xy-0.5);
    vec2 delta = vec2(1.65, 1.15)/pow(1.1, 40.*(cos(iTime/4.)+1.));
    
    vec2 c1 = center-delta;
    vec2 c2 = center+delta;
    
    vec2 scaled = vec2(scale(uv.x, c1.x, c2.x), scale(uv.y, c1.y, c2.y));
    
    fragColor = vec4(vec3(shade(scaled)), 1.0);
}
