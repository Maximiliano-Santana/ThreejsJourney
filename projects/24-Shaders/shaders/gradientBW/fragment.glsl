varying vec2 vUv;

#define PI 3.1415926535897932384626433832795

float random (vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

vec2 rotate(vec2 uv, float rotation, vec2 mid)
{
    return vec2(
      cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
      cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
    );
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

  // //-------------- Pattern 23
  // vec2 gridUv = vec2(
  //   floor(vUv.x * 10.0)/10.0,
  //   floor(vUv.y * 10.0)/10.0
  // );

  // float strength = random(gridUv);
  // gl_FragColor = vec4(strength, strength, strength, 1.0);
  // //-------------- Pattern 25
  // vec2 gridUv = vec2(
  //   floor(vUv.x * 10.0)/10.0,
  //   floor((vUv.y+ vUv.x * 0.5)*10.0)/10.0
  // );

  // float strength = random(gridUv);
  // gl_FragColor = vec4(strength, strength, strength, 1.0);

  // //-------------- Pattern 26
  // float strength = length(vUv);

  // gl_FragColor = vec4(strength, strength, strength, 1.0);
  
  // //-------------- Pattern 27
  // float strength = length(vUv);

  // gl_FragColor = vec4(strength, strength, strength, 1.0);
  // // //-------------- Pattern 28
  // float strength = 0.01 / distance(vUv, vec2(0.5, 0.5));

  // gl_FragColor = vec4(strength, strength, strength, 1.0);
  
  // // //-------------- Pattern 29
  // vec2 lightUV = vec2 (
  //   vUv.x*0.5+0.25,
  //   vUv.y
  // );

  // float strength = 0.015/distance(lightUV, vec2(0.5));


  // gl_FragColor = vec4(strength, strength, strength, 1.0);
  // // //-------------- Pattern 30
  // vec2 lightUvX = vec2 (vUv.x*0.1+0.45, vUv.y*0.5+0.25);
  // float lightX = 0.015/distance(lightUvX, vec2(0.5));
  
  // vec2 lightUvY = vec2 (vUv.y*0.1+0.45, vUv.x*0.5+0.25);
  // float lightY = 0.015/distance(lightUvY, vec2(0.5));
  
  // float strength = lightY*lightX-0.1;

  // gl_FragColor = vec4(strength, strength, strength, 1.0);
  // //-------------- Pattern 31
  // vec2 rotatedUv = rotate(vUv, PI*0.25, vec2(0.5));

  // vec2 lightUvX = vec2 (rotatedUv.x*0.1+0.45, rotatedUv.y*0.5+0.25);
  // float lightX = 0.015/distance(lightUvX, vec2(0.5));
  
  // vec2 lightUvY = vec2 (rotatedUv.y*0.1+0.45, rotatedUv.x*0.5+0.25);
  // float lightY = 0.015/distance(lightUvY, vec2(0.5));
  
  // float strength = lightY*lightX-0.1;

  // gl_FragColor = vec4(strength, strength, strength, 1.0);

  //// ----------- Pattern 32
  // float strength = step(1.0 - distance(vUv, vec2(0.5)), 0.75);

  // gl_FragColor = vec4(strength, strength, strength, 1.0);
  
  
  //// ----------- Pattern 33
  // float strength = 1.0 - step(abs(distance(vUv, vec2(0.5))-0.3), 0.025);

  // gl_FragColor = vec4(strength, strength, strength, 1.0);
  //// ----------- Pattern 34
  // float strength = step(abs(distance(vUv, vec2(0.5))-0.3), 0.025);

  // gl_FragColor = vec4(strength, strength, strength, 1.0);


  //// ----------- Pattern 35
  // vec2 waveUv = vec2(
  //   vUv.x + sin(vUv.y * 100.0) * 0.1,
  //   vUv.y + sin(vUv.x * 100.0) * 0.1
  // );

  // float strength = step(abs(distance(waveUv, vec2(0.5))-0.3), 0.01);

  // gl_FragColor = vec4(strength, strength, strength, 1.0);

  //----------------- Pattern 36
  // float angle = atan(vUv.x, vUv.y);
  
  // float strength = angle;

  // gl_FragColor = vec4(strength, strength, strength, 1.0);

  //----------------- Pattern 37
// float angle = atan(vUv.x - 0.5, vUv.y - 0.5) / (PI * 2.0) + 0.5;  
//   float strength = angle;
//   angle /= PI*2.0;
//   angle += 0.5;

//   gl_FragColor = vec4(strength, strength, strength, 1.0);

  //----------------- Pattern 37
//   float angle = atan(vUv.x - 0.5, vUv.y - 0.5) / (PI * 2.0) + 0.5;

// float strength = mod(angle * 20.0, 1.0);

//   gl_FragColor = vec4(strength, strength, strength, 1.0);

  //----------------- Pattern 38
//   float angle = atan(vUv.x - 0.5, vUv.y - 0.5) / (PI * 2.0) + 0.5;

// float strength = sin(angle*100.0);

//   gl_FragColor = vec4(strength, strength, strength, 1.0);

  //----------------- Pattern 38
  float angle = atan(vUv.x - 0.5, vUv.y - 0.5) / (PI * 2.0) + 0.5;
  float radius = 0.25 + sin(angle * 100.0) * 0.02;
  float strength = 1.0 - step(0.01, abs(distance(vUv, vec2(0.5)) - radius));
  gl_FragColor = vec4(strength, strength, strength, 1.0);

}
