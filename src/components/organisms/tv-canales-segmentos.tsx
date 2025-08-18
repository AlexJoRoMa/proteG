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
    
    
{/* {tituloResaltado && documentToReactComponents(tituloResaltado)}
    
    <div key={getComponentContent.sys.id}>

            
        </div>
    
    */}
    return(
        <div className="md:mx-md 2xl:mx-xl">

            {/* Botones de redirección */ }
            <div className=" w-full mt-15 flex justify-between">
                <ButtonGhost classStyles="border-black text-black text-[18px] leading-6 font-bold hover:!bg-black hover:!text-white 
                        w-full rounded-md h-[48px] w-[144px]"
                    text={textoBoton1 as string} href={linkBoton1 as string}
                    />
                <ButtonGhost classStyles="border-black text-white bg-black text-[18px] leading-6 font-bold hover:!bg-white hover:!text-black 
                        w-full rounded-md h-[48px] w-[205px] "
                    text={textoBoton2 as string} href={linkBoton2 as string}
                    />
            </div>
            
            {/* Titulo  principal*/ }
            <div className=" mt-10 text-[36px] text-center">
                        {tituloResaltado && documentToReactComponents(tituloResaltado)}
            </div>
        </div>
    );
}

export default TVCanalesSegmento;