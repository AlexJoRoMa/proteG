import Configurador from "@/components/organisms/configurador";
import PageDataTracker from '@/components/tracking/PageDataTracker';

export default function ConfiguradorPage() {
    return (
        <>
            <PageDataTracker pageType="landing" pageName="configurador" />
            <Configurador />
        </>
    )
}