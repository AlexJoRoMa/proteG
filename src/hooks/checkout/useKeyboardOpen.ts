'use client';

import { useEffect, useState } from "react";

export function useKeyboardOpen() {

    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleFocus = (e: FocusEvent) => {
            const target = e.target as HTMLElement;

            const isInput =
                target.tagName === "INPUT" ||
                target.tagName === "TEXTAREA" ||
                target.getAttribute("contenteditable") === "true";

            if (isInput) setIsOpen(true);
        };

        const handleBlur = () => {
            setTimeout(() => {
                const active = document.activeElement as HTMLElement | null;

                const isStillInput =
                    active &&
                    (active.tagName === "INPUT" ||
                        active.tagName === "TEXTAREA" ||
                        active.getAttribute("contenteditable") === "true"
                    );

                if (!isStillInput) {
                    setIsOpen(false);
                }
            }, 50);
        };

        window.addEventListener("focusin", handleFocus);
        window.addEventListener("focusout", handleBlur);

        return () => {
            window.removeEventListener("focusin", handleFocus);
            window.removeEventListener("focusout", handleBlur);
        };
    }, []);

    return isOpen;
}