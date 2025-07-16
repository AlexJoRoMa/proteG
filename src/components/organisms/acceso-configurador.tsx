import Image from "next/image";
import { AccesoConfiguradorID } from '@/types/ModelAccesoConfig';


const AccesoConfigurador = async ({id}: AccesoConfiguradorID) => {
    console.log('AccesoConfigurador');
    return(
        <h1>hello</h1>
    );
}

export default AccesoConfigurador