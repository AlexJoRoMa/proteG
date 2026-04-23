'use client';

import { useEffect } from "react";

export default function ResumenFlotante() {

    useEffect(() => {
        const el = document.getElementById('resumen-mobile');
        const parent = document.getElementById('resumen-parent');
        const end = document.getElementById('resumen-end');

        if (!el || !parent || !end) return;

        const update = () => {
            const parentReact = parent.getBoundingClientRect();
            const endReact = end.getBoundingClientRect();

            // Solo aplica a mobile
            if (window.innerWidth >= 1280) {
                el.style.position = '';
                el.style.bottom = '';
                el.style.left = '';
                el.style.width = '';
                return;
            }

            // Flotante
            if (endReact.top > window.innerHeight) {
                el.style.position = 'fixed';
                el.style.bottom = '0';
                el.style.left = parentReact.left + 'px';
                el.style.width = parentReact.width + 'px';
                el.style.zIndex = '20';
            } else {
                // Dentro del padre
                el.style.position = 'absolute';
                el.style.bottom = '0';
                el.style.left = '0';
                el.style.width = '100%';
            }
        };

        window.addEventListener('scroll', update);
        window.addEventListener('resize', update);

        update();

        return () => {
            window.removeEventListener('scroll', update);
            window.removeEventListener('resize', update);
        };
    }, []);

    return null;
}