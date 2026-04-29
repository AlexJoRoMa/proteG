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
            setIsOpen(false);
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