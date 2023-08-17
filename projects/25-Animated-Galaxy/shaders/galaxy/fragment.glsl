//We can't send the uv as a varying because each vertex is a particle, but we can use 
//gl_PointCoord

varying vec3 vColor;

void main (){
    //-------------------Point pattern
    //float strength = step(distance(gl_PointCoord, vec2(0.5)), 0.5);
    
    //------------------Difuse point pattern
    // float strength = distance(gl_PointCoord, vec2(0.5));
    // strength*=2.0;
    // strength = 1.0 - strength;

    // gl_FragColor = vec4(strength, strength, strength,1.0);

    // --------------------- Ligh point pattern
    float strength = distance(gl_PointCoord, vec2(0.5));
    strength = 1.0 - strength;
    strength = pow(strength, 5.0);

    // Final color 

    vec3 color = mix(vec3(0.0), vColor, strength);

    gl_FragColor = vec4(color, 1.0);
}
