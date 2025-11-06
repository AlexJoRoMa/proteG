'use client'

const STORAGE_KEY = 'trackingQueryString';

export function getPersistentQueryString(): string | null {
    if(typeof window !== 'undefined' && window.sessionStorage) {
        return sessionStorage.getItem(STORAGE_KEY);
    }
    return null;
}