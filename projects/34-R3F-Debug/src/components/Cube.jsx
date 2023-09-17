export default function Cube( {scale = 1} ){
    return<>
        <mesh position={[1, 0, 0]} rotation-y={Math.PI*0.25} scale={scale}>
            <boxGeometry />
            <meshStandardMaterial color={'#b8f881'} args={ [2, 2, 2, 4, 4, 4] } />
        </mesh>
    </>
}