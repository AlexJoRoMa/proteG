'use client'

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Error({ error }: { error: Error }) {
    const router = useRouter();

    useEffect(() => {
        console.error("Error capturado del cliente:", error);
        router.replace("/error");

    }, [error, router])

    return null;

}