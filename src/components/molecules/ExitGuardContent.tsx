'use client'

import { IzziLogo, ModalCopys } from "@/types/ModalAbandonoFlujo";
import { Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from "@heroui/react";
import { EntrySkeletonType } from "contentful";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export const CloseIcon = (props: any) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path d="M18 6.00005L6 18M5.99995 6L17.9999 18" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    )
}

export default function ExitGuardContent({ icon, text }: { icon: EntrySkeletonType<IzziLogo>, text: ModalCopys }) {

    const router = useRouter();
    const pathName = usePathname();
    const pendingRouteRef = useRef<string | null>(null);
    const scopePrefix = "/configurador";

    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

    const currentPathRef = useRef<string>("");

    useEffect(() => {
        currentPathRef.current = window.location.pathname + window.location.search + window.location.hash;
    }, [pathName]);

    // Helper: decidir si debemos bloquear URL destino.

    const shouldGuard = (destUrl: URL) => {
        const isSameOrigin = destUrl.origin === window.location.origin;

        if (!isSameOrigin) return false;

        const destPath = destUrl.pathname;

        if (scopePrefix) {
            return !destPath.startsWith(scopePrefix);
        }
        return destPath !== window.location.pathname;
    };



    //Interceptar reload del navegador.

    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault();
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);

    }, []);



    return (
        <>
        modal
        </>
    )
}
