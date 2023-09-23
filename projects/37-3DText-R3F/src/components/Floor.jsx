import { MeshReflectorMaterial } from "@react-three/drei"

export default function Floor(){
    return <>
        <mesh rotation-x={-Math.PI*0.5} position-y={-2.5} receiveShadow>
          <planeGeometry args={[50, 50]}/>
          <MeshReflectorMaterial
            color={'lightblue'}
            blur={[1000, 1000]} 
            mixBlur={0.75} 
            mixStrength={1} 
            mixContrast={1} 
            resolution={1000} 
            mirror={0} 
            depthScale={0}
            minDepthThreshold={0.9} 
            maxDepthThreshold={1} 
            depthToBlurRatioBias={0.25} 
            distortion={1} 
            debug={0} 
            reflectorOffset={0.2}
          />
        </mesh>
    </>
}