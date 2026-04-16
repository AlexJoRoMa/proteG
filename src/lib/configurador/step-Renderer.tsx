'use client'

import dynamic from "next/dynamic";
import { StepProps } from "@/types/ConfiguradorTypes";
import { LoaderIcon } from "@/constants/IconsConstants";

const LoadingState = () => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70">
            <div className="w-[104px] h-[104px]">
                <LoaderIcon />
            </div>
        </div>
    )
}
export const dynamicMap: Record<
    "internet" | "tv" | "movil",
    React.ComponentType<StepProps>
> = {
    internet: dynamic(() => import("@/components/molecules/configurador/planesInternet"),
        {
            ssr: false,
            loading: () => <LoadingState />
        }
    ),
    tv: dynamic(() => import("@/components/molecules/configurador/planesTv"),
        {
            ssr: false,
            loading: () => <LoadingState />
        }
    ),
    movil: dynamic(() => import("@/components/molecules/configurador/planesMovil"),
        {
            ssr: false,
            loading: () => <LoadingState />
        }
    ),
};

type StepKey = "internet" | "tv" | "movil";
type Props = {
    steps: readonly StepKey[];
    preSeleccion: StepProps["preSeleccion"]
};

export default function StepsRenderer({ steps, preSeleccion }: Props) {
    return (
        <>
            {steps.map((stepKey, index) => {
                const Component = dynamicMap[stepKey];

                return (
                    <Component
                        key={stepKey}
                        step={index + 1}
                        preSeleccion={preSeleccion}
                    />
                );
            })}
        </>
    );
}