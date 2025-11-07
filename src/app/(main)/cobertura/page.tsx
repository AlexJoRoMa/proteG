import Cobertura from "./cobertura";
import React, {Suspense} from "react";
import { LoaderIcon } from '@/constants/IconsConstants';

export default function CoberturaPage() {

    return(
        <>
        <Suspense  fallback={
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70">
            <div className="w-[104px] h-[104px]">
                <LoaderIcon />
            </div>
            </div>}>
            <Cobertura />
        </Suspense>
        </>
    )
}