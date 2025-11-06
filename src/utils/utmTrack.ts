'use client'

import { useSearchParams } from "next/navigation"
import { useEffect } from "react"

const STORAGE_KEY = 'trackingQueryString';

export default function UrlPersister() {
    const searchParams = useSearchParams();

    useEffect(() => {
        const paramsObject = new URLSearchParams();
        let hasUtm = false;

        searchParams.forEach((value, key) => {
            if(typeof value === 'string') {
                paramsObject.append(key, value);
            }
            if( key.startsWith('utm')){
                hasUtm = true;
            }
        });

        const queryString = paramsObject.toString();

        if(hasUtm&& queryString.length > 0){
            const  existingQuery = sessionStorage.getItem(STORAGE_KEY);

            if(!existingQuery && typeof window !== 'undefined' && window.sessionStorage) {
                sessionStorage.setItem(STORAGE_KEY, queryString);
            }
        }


    }, [searchParams])
    
    return null;
    
}