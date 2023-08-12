varying vec2 vUv;

float random (vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

void main(){
  // float strength = 1.0 - vUv.y;
  // gl_FragColor = vec4(strength, strength, strength, 1.0);

  //----------------Pattern 6
  // float strength = vUv.y*10.0;
  // gl_FragColor = vec4(strength, strength, strength, 1.0);
  //----------------Pattern 7
  // float strength = mod(vUv.y*10.0, 1.0);
  // gl_FragColor = vec4(strength, strength, strength, 1.0);

  //----------------Pattern 8
  // float strength = mod(vUv.y*10.0, 1.0);
  // strength = step(0.5, strength);

  // gl_FragColor = vec4(strength, strength, strength, 1.0);
  
  //----------------Pattern 9
  //   float strength = mod(vUv.y*10.0, 1.0);
  // strength = step(0.85, strength);

  // gl_FragColor = vec4(strength, strength, strength, 1.0);
  
  //----------------Pattern 10
  //   float strength = mod(vUv.x*10.0, 1.0);
  // strength = step(0.85, strength);

  // gl_FragColor = vec4(strength, strength, strength, 1.0);

  //----------------Pattern 11
  // float strength = step(0.85, mod(vUv.x*10.0, 1.0));
  // strength -= step(0.85, mod(vUv.y*10.0, 1.0));

  // gl_FragColor = vec4(strength, strength, strength, 1.0);

  //----------------Pattern 12
  // float strength = step(0.85, mod(vUv.x*10.0, 1.0));
  // strength *= step(0.85, mod(vUv.y*10.0, 1.0));

  // gl_FragColor = vec4(strength, strength, strength, 1.0);
  
  //----------------Pattern 13
  // float strength = step(0.2, mod(vUv.x*10.0, 1.0));
  // strength *= step(0.85, mod(vUv.y*10.0, 1.0));

  // gl_FragColor = vec4(strength, strength, strength, 1.0);

  //----------------Pattern 13
  // float barX = step(0.2, mod(vUv.x*10.0, 1.0));
  // barX *= step(0.85, mod(vUv.y*10.0, 1.0));

  // float barY = step(0.2, mod(vUv.y*10.0, 1.0));
  // barY *= step(0.85, mod(vUv.x*10.0, 1.0));

  // float strength = barY + barX;
  // gl_FragColor = vec4(strength, strength, strength, 1.0);

  //----------------Pattern 14
  // float barX = step(0.4, mod(vUv.x*10.0 +0.25, 1.0));
  // barX *= step(0.85, mod(vUv.y*10.0, 1.0));

  // float barY = step(0.4, mod(vUv.y*10.0+ 0.25, 1.0));
  // barY *= step(0.85, mod(vUv.x*10.0, 1.0));

  // float strength = barY + barX;
  // gl_FragColor = vec4(strength, strength, strength, 1.0);

  //----------------- Pattern 15
  // float strength = abs(vUv.x-0.5);
  // gl_FragColor = vec4(strength, strength, strength, 1.0);

  //----------------- Pattern 16
  // float strength = min(abs(vUv.x-0.5), abs(vUv.y-0.5));
  // gl_FragColor = vec4(strength, strength, strength, 1.0);

  //----------------- Pattern 17
  // float strength = max(abs(vUv.x-0.5), abs(vUv.y-0.5));
  // gl_FragColor = vec4(strength, strength, strength, 1.0);

  // //----------------- Pattern 18
  // float strength = step(0.45, (max(abs(vUv.x-0.5), abs(vUv.y-0.5))));
  // gl_FragColor = vec4(strength, strength, strength, 1.0);

    //----------------- Pattern 19
  // float strength = step(0.45, (max(abs(vUv.x-0.5), abs(vUv.y-0.5))));
  // strength += 1.0 - step(0.2, (max(abs(vUv.x-0.5), abs(vUv.y-0.5))));
  // gl_FragColor = vec4(strength, strength, strength, 1.0);

  //--------------- Pattern  20
  // float strength = floor(vUv.x*10.0)/10.0;
  // gl_FragColor = vec4(strength, strength, strength, 1.0);

  //--------------- Pattern  21
  // float strength = floor(vUv.x*10.0)/10.0;
  // strength *= floor(vUv.y*10.0)/10.0;

  // gl_FragColor = vec4(strength, strength, strength, 1.0);

  //--------------- Pattern  22
  // float strength = (random(vUv));

  // gl_FragColor = vec4(strength, strength, strength, 1.0);

  //-------------- Pattern 23
  vec2 gridUv = vec2(
    floor(vUv.x * 10.0)/10.0,
    floor(vUv.y * 10.0)/10.0
  );

  float strength = random(gridUv);
  gl_FragColor = vec4(strength, strength, strength, 1.0);
}
