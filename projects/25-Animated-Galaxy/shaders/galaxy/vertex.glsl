attribute float aScale;
attribute vec3 aRandomness;

uniform float uSize;
uniform float uTime;

varying vec3 vColor;

void main (){
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    //-------------------------- Animate the galaxy
    //We calculate the paticle angle and its disntance to the center
    //We increase that angle according to uTime and the distance
    //We update the position accordin to that new angle

    float angle = atan(modelPosition.x, modelPosition.z);
    float distanceToCenter = length (modelPosition.xz);
    float angleOffset = (1.0 / distanceToCenter) * uTime * 0.2;

    angle += angleOffset;

    modelPosition.x = sin(angle) * distanceToCenter ;
    modelPosition.z = cos(angle) * distanceToCenter ;

    // Apply Randomness 
    modelPosition.xyz += aRandomness * 0.5 ;

    vec4 viewPosition = viewMatrix * modelPosition;
    

    vec4 projectesPosition = projectionMatrix * viewPosition;

    gl_Position = projectesPosition;

    gl_PointSize = uSize * aScale;

    // This will add perspetcive to the points
    gl_PointSize *= (1.0/ -viewPosition.z);


    vColor = color;
}