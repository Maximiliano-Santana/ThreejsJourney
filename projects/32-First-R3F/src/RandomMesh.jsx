import * as THREE from 'three'
import { useMemo, useRef, useEffect } from 'react'

export default function RandomMesh(){
    const geometryRef = useRef();

    const vertexCount = 10*3;

    const positions = useMemo(()=>{
        const positions = new Float32Array(vertexCount * 3); 
        for (let i = 0; i < vertexCount*3; i++){
            positions[i] = (Math.random() - 0.5) * 3;
        }
        return positions
    }, [])

    useEffect(()=>{
        console.log(geometryRef.current.computeVertexNormals)
        geometryRef.current.computeVertexNormals();

    }, [])


    return <mesh>
        <bufferGeometry ref={ geometryRef } >
            <bufferAttribute 
            attach="attributes-position" 
            count={vertexCount }
            itemSize={ 3 }
            array={ positions }
        />
        </bufferGeometry>
        <meshStandardMaterial color="red" side={ THREE.DoubleSide }/>
    </mesh>
}