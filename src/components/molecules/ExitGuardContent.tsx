/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { IzziLogo, ModalCopys } from "@/types/ModalAbandonoFlujo";
import { Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from "@heroui/react";
import { EntrySkeletonType } from "contentful";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useIzziContent } from "../providers/IzziProvider";
import izziDataLayerHelpers from "@/utils/izzi-data-layer-helpers";
import { EVENTS } from "@/lib/tracking/constants";

export const CloseIcon = (props: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" {...props}>
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

const CHECKOUT_STEP_NAMES: Record<number, string> = {
    1: "package_configuration",
    2: "personal_data",
    3: "contact_verification",
    4: "documents",
    5: "installation_date",
    6: "payment",
};

export default function ExitGuardContent({ icon, text }: { icon: EntrySkeletonType<IzziLogo>, text: ModalCopys }) {

    const router = useRouter();
    const pathName = usePathname();
    const pendingRouteRef = useRef<string | null>(null);
    const isMobile = useIsMobile(768);
    const scopePrefix = ["/configurador", "/checkout", "/thank-you"];
    const { clearCheckoutFlow } = useIzziContent();
    const exitIntentTrackedRef = useRef(false);

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
        const isAllowed = scopePrefix.some((prefix) => destPath.startsWith(prefix));
        return !isAllowed;
    };

    // Helpers de tracking compartidos

    const getCheckoutTrackingParams = () => {
        const sessionId = window.sessionStorage.getItem("izzi-checkout-session-id") || undefined;
        const rawStep = window.sessionStorage.getItem("izzi-checkout-current-step");
        const step = rawStep ? parseInt(rawStep, 10) : undefined;
        return { sessionId, step };
    };

    const trackCheckoutExitIntent = () => {
        if (typeof window === "undefined") return;
        if (!window.location.pathname.startsWith("/checkout")) return;

        const { sessionId, step } = getCheckoutTrackingParams();
        const extraParams: Record<string, unknown> = {};
        if (sessionId) extraParams.checkout_session_id = sessionId;
        if (step) {
            extraParams.exit_intent_checkout_step = step;
            extraParams.exit_intent_checkout_step_name = CHECKOUT_STEP_NAMES[step] ?? `step_${step}`;
        }

        izziDataLayerHelpers.pushEcommerceEvent(
            EVENTS.CHECKOUT_EXIT_INTENT,
            {},
            Object.keys(extraParams).length > 0 ? extraParams : undefined
        );
    };

    const trackCheckoutAbandon = (reason: string) => {
        if (typeof window === "undefined") return;
        if (!window.location.pathname.startsWith("/checkout")) return;

        const { sessionId, step } = getCheckoutTrackingParams();
        const extraParams: Record<string, unknown> = { abandon_reason: reason };
        if (sessionId) extraParams.checkout_session_id = sessionId;
        if (step) {
            extraParams.abandon_checkout_step = step;
            extraParams.abandon_checkout_step_name = CHECKOUT_STEP_NAMES[step] ?? `step_${step}`;
        }

        izziDataLayerHelpers.pushEcommerceEvent(EVENTS.CHECKOUT_ABANDON, {}, extraParams);
    };

    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault();
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, []);

    // Tracking por cambio de visibilidad (cambiar tab, minimizar, cerrar pestaña)

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                exitIntentTrackedRef.current = false;
                return;
            }
            if (!window.location.pathname.startsWith("/checkout")) return;
            if (exitIntentTrackedRef.current) return;

            exitIntentTrackedRef.current = true;
            trackCheckoutExitIntent();
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, []);

    // Tracking por cierre real de página (pagehide cubre cierre de tab y navegación)

    useEffect(() => {
        const handlePageHide = () => {
            trackCheckoutAbandon("page_unload");
        };

        window.addEventListener('pagehide', handlePageHide);
        return () => window.removeEventListener('pagehide', handlePageHide);
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
                trackCheckoutExitIntent();
                onOpen();
            }, 0);
        }

        document.addEventListener("click", onDocumentClick, true);
        return () => document.removeEventListener("click", onDocumentClick, true);

    }, [onOpen, scopePrefix, shouldGuard]);

    //Confirmar salida del flujo.

    const confirmExit = () => {
        const toRoute = pendingRouteRef.current;
        pendingRouteRef.current = null;
        clearCheckoutFlow();
        onClose();
        trackCheckoutAbandon("user_confirmed_exit");

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
                size={isMobile ? 'full' : '5xl'}
                hideCloseButton
                backdrop="opaque"
            >
                <ModalContent>
                    {() => (
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
                                        src={`https:${icon.fields.image.fields.file.url}`}
                                        alt={icon.fields.altText}
                                        width={icon.fields.image.fields.file.details.image.width}
                                        height={icon.fields.image.fields.file.details.image.height}
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
                                        className="font-bold text-lg leading-[24px] underline cursor-pointer"
                                    >{text.textoAbandonoFlujo}</span>
                                </div>
                                <button
                                    onClick={handleCancel}
                                    className="cursor-pointer w-[320px] py-[14px] px-[16px] rounded-md bg-black-0 font-bold text-lg leading-[24px] text-white-0"
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
