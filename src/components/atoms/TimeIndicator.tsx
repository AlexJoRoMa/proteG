import React from 'react';

async function getDataTimestamp(){
    const res = await fetch('https://worldtimeapi.org/api/timezone/America/Mexico_City');
  const data = await res.json();
  
  const generationTime = new Date(data.datetime).toLocaleTimeString('es-ES');
  return generationTime;
}

export default async function TimeIndicator() {
  const time = await getDataTimestamp();
  
  return (
    <div style={{ position: 'fixed', bottom: 10, right: 10, zIndex: 1000, 
                  backgroundColor: '#000', color: '#fff', padding: '5px 10px', 
                  borderRadius: '5px', fontSize: '12px' }}>
      Generación: **{time}**
    </div>
  );
}