import PlanesInternet from "@/components/molecules/configurador/planesInternet";
import PlanesMovil from "@/components/molecules/configurador/planesMovil";
import PlanesTv from "@/components/molecules/configurador/planesTv";
import { StepProps } from "@/types/ConfiguradorTypes";


export const componentMap: Record<
    "internet" | "tv" | "movil",
    React.ComponentType<StepProps>
> = {
    internet: PlanesInternet,
    tv: PlanesTv,
    movil: PlanesMovil,
}