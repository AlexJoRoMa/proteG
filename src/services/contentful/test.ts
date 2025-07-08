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


// Tabs Component Delivery API call

export async function getTabsResourceSetType() {

    const data = await contentfulClient.getEntries({
        content_type: 'resourceSet',
        include: 2
    });

    return data.items;
}
export async function getTabsContentType(pageName:string) {

    const data = await contentfulClient.getEntries({
        content_type: 'tabsContainer', 
        'fields.internalName': pageName,
        include: 5
    });

    return data.items[0];
}