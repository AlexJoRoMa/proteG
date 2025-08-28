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

function useIsMobile(breakpoint = 768) {
    const [isMobile, setIsMobile] = useState(() =>
        typeof window === "undefined" ? true : window.innerWidth < breakpoint);

    useEffect(() => {
        function onResize() {
            setIsMobile(window.innerWidth < breakpoint);
        }
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, [breakpoint]);

    return isMobile;
}

export default function ExitGuardContent({ icon, text }: { icon: EntrySkeletonType<IzziLogo>, text: ModalCopys }) {

    const router = useRouter();
    const pathName = usePathname();
    const pendingRouteRef = useRef<string | null>(null);
    const isMobile = useIsMobile(768);
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

    //Captura de clicks (<a> || <Link>)

    useEffect(() => {
        const onDocumentClick = (e: MouseEvent) => {

            if (e.defaultPrevented || e.button !== 0) return;
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

            let element = e.target as HTMLElement | null;
            while (element && element.nodeName !== "A") element = element.parentElement;
            const anchor = element as HTMLAnchorElement | null;

            if (!anchor) return;

            if (anchor.getAttribute("data-bypass-guard") === "true") return;
            if (anchor.target && anchor.target !== "_self") return;
            if (anchor.hasAttribute("download")) return;
            const rel = anchor.getAttribute("rel") || "";
            if (rel.includes("external")) return;

            const rawHref = anchor.getAttribute("href");
            if (!rawHref) return;
            if (rawHref.startsWith("#")) return;

            const url = new URL(rawHref, window.location.href);

            if (!shouldGuard(url)) return;

            e.preventDefault();
            e.stopPropagation();

            pendingRouteRef.current = url.pathname + url.search + url.hash;
            setTimeout(() => {
                onOpen();
            }, 0);
        }

        document.addEventListener("click", onDocumentClick, true);
        return () => document.removeEventListener("click", onDocumentClick, true);

    }, [onOpen, scopePrefix]);

    //Confirmar salida del flujo.

    const confirmExit = () => {
        const toRoute = pendingRouteRef.current;
        pendingRouteRef.current = null;
        onClose();

        if (toRoute) {
            currentPathRef.current = toRoute;
            router.push(toRoute);
        }
    };

    //Cancelar salida del flujo.

    const handleCancel = () => {
        pendingRouteRef.current = null;
        onClose();
        const current = window.location.pathname + window.location.search + window.location.hash;
        if (current !== currentPathRef.current) {
            window.history.replaceState(null, "", currentPathRef.current);
        }
    };

    return (
        <>
            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                placement="center"
                classNames={{
                    base: "w-full rounded-md",
                    header: "justify-end pt-[24px] px-[24px] pb-0",
                    body: "flex flex-col justify-center items-center gap-[40px] mx-[40px] md:mx-[56px] my-[138px] md:my-0 md:mb-[57px] p-0",
                    backdrop: "bg-black-0/80"
                }}
                size={'5xl'}
                hideCloseButton
                backdrop="opaque"
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>
                                <div className="flex items-center justify-center" onClick={handleCancel}>
                                    <CloseIcon className="w-[32px] h-[32px]" />
                                </div>
                            </ModalHeader>
                            <ModalBody>
                                <>
                                    <Image
                                        className="w-[148px] md:w-[240px] h-auto"
                                        src={`https:${icon.fields.file.url}`}
                                        alt={icon.fields.title}
                                        width={icon.fields.file.details.image.width}
                                        height={icon.fields.file.details.image.height}
                                    />
                                </>
                                <div className="flex flex-col justify-center items-center text-center gap-[24px] w-full">
                                    <h1 className="font-bold text-4xl leading-[48px]">
                                        {text.titulo}
                                    </h1>
                                    <h3 className="font-normal text-lg leading-[24px]">
                                        {text.descripcion}
                                    </h3>
                                    <span
                                        onClick={confirmExit}
                                        className="font-bold text-lg leading-[24px] underline"
                                    >{text.textoAbandonoFlujo}</span>
                                </div>
                                <button
                                    onClick={handleCancel}
                                    className="w-[320px] py-[14px] px-[16px] rounded-md bg-black-0 font-bold text-lg leading-[24px] text-white-0"
                                >{text.textoPermanenciaFlujo}</button>
                                <div>
                                    <p className="text-lg leading-[24px] text-center">
                                        <span className="font-normal">{`${text.infoAdicional.textoLlamanos} `}</span>
                                        <span className="font-bold">{text.infoAdicional.contactoLlamanos}</span>
                                    </p>
                                </div>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}
