import { Entry, EntrySkeletonType } from 'contentful';
import {contentfulClient} from './client';
import { FilteredData } from "@/types/MicrocopyTypes";
    
    // Microcopys Delivery API call
    
export async function getAllCopy(componentName : string): Promise<FilteredData[]> {
    const copy = await contentfulClient.getEntries({
        content_type: 'resourceSet',
        'fields.name': componentName,
        include: 2
    });

    return copy.items;
}

export async function getMicroCopy(key : string): Promise<Entry<EntrySkeletonType, undefined, string>[]> {
    const copy = await contentfulClient.getEntries({
        content_type: 'resource',
        'fields.key': key
    });

    return copy.items;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setNestedValue(obj: any, path: string, value: string) {
    const keys = path.split('.');
    let current = obj;

    keys.forEach((key, index) => {
        if(index === keys.length -1) {
            current[key] = value;
        } else {
            current[key] = current[key] || {};
            current = current[key];
        }
    });
}

export async function getCopyForComponent(componentName: string): Promise<Record<string, string>> {
    const data = await getAllCopy(componentName);
    const filteredData = data[0];

    if(!filteredData) {
        throw new Error(`No se encontró el componente ${componentName}`);
    }
    
    const resourcesArray = filteredData?.fields?.resources ?? [];
    const entries: Record<string, string> = {};
    
    resourcesArray.forEach((resource) => {
        const key = resource.fields.key;
        const value = resource.fields.value;

        if (key !== undefined && value !== undefined) {
            setNestedValue(entries, key, value);
        }
    })

    return entries;


}

export async function fetchComponentByTypeModal(type: string, content_type: string) {
    
       return await contentfulClient.getEntries({
          content_type: content_type,
          'fields.type': type
        });
}