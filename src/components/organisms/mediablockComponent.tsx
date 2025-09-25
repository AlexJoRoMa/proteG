import Image from "next/image";
import { MediaBlockModelID } from '@/types/IzziGOTypes';
import { contentfulClient } from "@/services/contentful/client";
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { Asset, Entry, EntrySkeletonType } from "contentful";
import ButtonGhost from "../atoms/ButtonGhost";

const MediaBlockModel = async ({id}: MediaBlockModelID) => {

    return(
        <h1>hello</h1>
    )
}

export default MediaBlockModel