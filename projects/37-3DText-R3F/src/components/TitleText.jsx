import { Text3D, Center, useMatcapTexture } from "@react-three/drei"

export default function TitleText(){

    const [matcapTexture] =  useMatcapTexture('161B1F_C7E0EC_90A5B3_7B8C9B', 512);

    return <>
        <Center position-y={6}>
            <Text3D font="./fonts/MinecraftTitle.json" castShadow>
                <meshMatcapMaterial matcap={matcapTexture}/>
                PARA LA MEJOR NOVIA
            </Text3D>
        </Center>

        <Center position-y={4}>
            <Text3D font="./fonts/MinecraftFont.json" castShadow>
                <meshNormalMaterial/>
                Te amo culona {'<3'}
            </Text3D>
        </Center>
    </>
}