import { Center, Text3D, useMatcapTexture } from '@react-three/drei';
import React, { useState, useEffect } from 'react';


function DateCounter({dataTimer}) {
  // const fechaObjetivo = new Date('2023-09-21T00:00:00');
  const fechaObjetivo = new Date('2023-09-21T14:10:50');
  const [tiempoRestante, setTiempoRestante] = useState(calcularTiempoRestante());

  const [matcapTexture] = useMatcapTexture('6D1616_E6CDBA_DE2B24_230F0F', 512);

  const [visible, setVisible] = useState();
  

  const send = ()=>{
    dataTimer(true);
  }


  useEffect(() => {
    const interval = setInterval(() => {
      const tiempoFaltante = calcularTiempoRestante();
      setTiempoRestante(tiempoFaltante);
      
      
      if(tiempoFaltante.dias <= 0 && tiempoFaltante.horas <= 0 && tiempoFaltante.minutos <= 0 && tiempoFaltante.segundos <= 0 ){
        setVisible(false)
        console.log(visible)
        send();
      }
      // console.log(tiempoFaltante)
    }, 1000);

    // Limpia el intervalo cuando el componente se desmonta
    return () => clearInterval(interval);
  }, []);

  function calcularTiempoRestante() {
    const ahora = new Date().getTime();
    const tiempoRestanteEnMilisegundos = fechaObjetivo - ahora;

    const segundos = Math.floor((tiempoRestanteEnMilisegundos / 1000) % 60);
    const minutos = Math.floor((tiempoRestanteEnMilisegundos / 1000 / 60) % 60);
    const horas = Math.floor((tiempoRestanteEnMilisegundos / 1000 / 60 / 60) % 24);
    const dias = Math.floor(tiempoRestanteEnMilisegundos / 1000 / 60 / 60 / 24);

    return {
      dias,
      horas,
      minutos,
      segundos,
    };
  }

  return <>
      <Center visible={visible}>
        <Text3D font="./fonts/MinecraftFont.json" castShadow >
            <meshMatcapMaterial matcap={matcapTexture} wire/>
            {tiempoRestante.dias} : {tiempoRestante.horas} : {tiempoRestante.minutos} : {tiempoRestante.segundos}
        </Text3D>
      </Center>
  </>

  
}

export default DateCounter;