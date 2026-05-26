import Cobertura from "./cobertura";
import React, {Suspense} from "react";
import { LoaderIcon } from '@/constants/IconsConstants';
import PageDataTracker from '@/components/tracking/PageDataTracker';

export default function CoberturaPage() {

    return(
        <>
        <PageDataTracker pageType="support" pageName="consulta_cobertura" />
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