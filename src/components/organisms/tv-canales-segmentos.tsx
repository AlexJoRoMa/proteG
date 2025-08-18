import Image from "next/image";
import { TVCanalesSegmentoID, TVCanalesSkeleton, TVCanalesSegmentoSkeleton, CanalesContenedorFields } from '@/types/TvCanalesSegmentosTypes';
import { contentfulClient } from "@/services/contentful/client";
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { Asset, Entry, EntrySkeletonType } from "contentful";
import ButtonGhost from "../atoms/ButtonGhost";

const TVCanalesSegmento = async ({id} : TVCanalesSegmentoID) =>{

    const callComponents:Entry<EntrySkeletonType, undefined, string>[] | null = await contentfulClient.getEntries({
        content_type: "tvCanalesContenedor",
        'sys.id': id,
        select: ['fields.tituloResaltado',
            'fields.textoBoton1',
            'fields.linkBoton1',
            'fields.textoBoton2',
            'fields.linkBoton2',
            'fields.segmentosCanales'
             ],
        include: 2,
    }).then((entriesResponse) => {
        return entriesResponse.items
    });
    
    if(!callComponents){
        return null;
    }

    const getComponentContent= callComponents[0] as unknown as Entry<TVCanalesSkeleton>;
    
    const { tituloResaltado, textoBoton1, linkBoton1, textoBoton2, linkBoton2, segmentosCanales  } = getComponentContent.fields as CanalesContenedorFields;
    
    
{/* {tituloResaltado && documentToReactComponents(tituloResaltado)} */}
    return(
        <div key={getComponentContent.sys.id}>

            
        </div>
    );
}

export default TVCanalesSegmento;