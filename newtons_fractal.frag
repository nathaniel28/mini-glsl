#define ITERATIONS 40

vec2 cmplxMul(vec2 a, vec2 b) {
    return vec2(a.x*b.x - a.y*b.y, a.x*b.y + a.y*b.x);
}

vec2 cmplxDiv(vec2 a, vec2 b) {
    float c = b.x*b.x + b.y*b.y;
    return vec2((a.x*b.x + a.y*b.y)/c, (a.y*b.x - a.x*b.y)/c);
}

vec2 roots[5] = vec2[](
    vec2(-0.94771795724, 0.),
    vec2(0.662358978622, 0.562279512062),
    vec2(0.662358978622, -0.562279512062),
    vec2(0., 1.),
    vec2(0., -1.)
);

vec4 F(vec2 x) {
    vec2 res = x - roots[0];
    vec2 resp = x - roots[1];
    for (int i = 1; i < roots.length()-1; i++) {
        resp = cmplxMul(resp + res, x - roots[i+1]);
        res = cmplxMul(res, x - roots[i]);
    }
    resp += res;
    res = cmplxMul(res, x - roots[roots.length()-1]);
    return vec4(res, resp);
}

vec3 shade(vec2 n) {
    for (int i = 0; i < ITERATIONS; i++) {
        vec4 d = F(n);
        n -= cmplxDiv(d.xy, d.zw);
    }
    int ind = 0;
    float mi = distance(n, roots[0]);
    for (int i = 1; i < roots.length(); i++) {
        float d = distance(n, roots[i]);
        if (d < mi) {
            ind = i;
            mi = d;
        }
    }
    if (mi > 0.2) {
        return vec3(0);
    }
    vec3 palette[roots.length()] = vec3[](
        vec3(0.38671875, 0.87890625, 0.9062500),
        vec3(0.10937500, 0.1171875, 0.64453125),
        vec3(0.44140625, 0.8046875, 0.57421875),
        vec3(0.40234375, 0.7187500, 0.73437500),
        vec3(0.17578125, 0.5195313, 0.53515625)
    );
    return palette[ind];
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord/iResolution.xy;
    
    roots[0].x += iMouse.x/iResolution.x-0.5;
    
    fragColor = vec4(shade((uv-0.5)*0.25+vec2(-0.14, 0.)), 0.);
}
