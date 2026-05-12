import { ReactNode, useEffect, useRef, useState } from "react";

interface ResumenAdaptativoProps {
    title: string,
    children: ReactNode,
    footer: ReactNode,
    maxHeight?: number;
}

export function ResumenAdaptativo({
    title,
    children,
    footer,
    maxHeight = 714,
}: ResumenAdaptativoProps) {

    const contentRef = useRef<HTMLDivElement>(null);

    const [hasOverflow, setHasOverflow] = useState<boolean>(false);

    useEffect(() => {
        const element = contentRef.current;

        if (!element) return;

        const checkOverflow = () => {
            setHasOverflow(
                element.getBoundingClientRect().height > maxHeight
            );
        };

        checkOverflow();

        const resizeObserver = new ResizeObserver(() => {
            checkOverflow();
        });

        resizeObserver.observe(element);

        window.addEventListener('resize', checkOverflow);

        return () => {
            resizeObserver.disconnect();
            window.removeEventListener('resize', checkOverflow);
        };
    }, [maxHeight]);

    return (
        <div ref={contentRef}>

            {/* HEADER */}
            <div className="font-bold leading-[24px] text-xl px-[16px] mb-[32px]">
                {title}
            </div>

            {/* CONTENT */}
            <div
                className="flex flex-col"
                style={{
                    maxHeight: maxHeight
                }}
            >
                <div className={`px-[16px] ${hasOverflow
                    ? "overflow-y-auto custom-scroll"
                    : ""
                    }`}
                >
                    {children}
                </div>

                {/* FOOTER */}
                <div
                    className={hasOverflow
                        ? "px-[16px] shadow-[0_-2px_20px_-4px_rgba(0,0,0,0.12)] py-[32px]"
                        : "px-0 mx-[16px] py-[32px] border-t-1 border-t-gray-150"
                        }
                >
                    {footer}
                </div>

            </div>

        </div>
    )
}