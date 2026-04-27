
let currentFullPath: string | null = null;

export function setFullPath(path: string) {
    currentFullPath = path;
}

export function getFullPath(){
    return currentFullPath;
}

export function getTrackingBase(){
    //ruta por defecto
    if(!currentFullPath) return '/';

    //fallback en caso de que url no cumpla
    const segments = currentFullPath.split('/');
    if(segments.length <= 1) return '/';

    //regresa toda los segmentos excepto el ultimo
    return '/' + segments.slice(0, -1).join('/');
}