import { CheckPlanesIcon, DropIcon, LoaderIcon } from "@/constants/IconsConstants";
import { useMicrocopies } from "@/hooks/useMicrocopies";
import { OttProps, OttsImages, PackageInfo } from "@/types/ConfiguradorTypes";
import { PlanesTypes } from "@/types/PlanesExtrasTypes";
import { useContent } from "@/utils/ConfiguradorProvider";
import { FormatCurrency } from "@/utils/Currency";
import { Accordion, AccordionItem, Card, CardBody, CardFooter, CardHeader } from "@heroui/react";
import { EntrySkeletonType } from "contentful";
import Image from "next/image";
import { Key, useEffect, useState } from "react";
import useSWR from "swr";

const fetchGetPackageInfo = async ([, data]: [string, PackageInfo]) => {
    const res = await fetch('/api/configurador/planes-extras', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return res.json();
};

export default function AccordionPlanesExtras() {

    const { getValue: configValue } = useMicrocopies('Configurador');
    const { rawData, getValue } = useMicrocopies('configurador-otts');

    const itemClasses = {
        indicator: "data-[open=true]:rotate-180",
        title: "leading-[24px] font-normal text-base",
    }

    const content = useContent();
    const ottsImages = content.ottsImages as unknown as EntrySkeletonType<OttsImages>[];

    const [selectedCard, setSelectedCard] = useState<OttProps[]>([]);

    const packageInfo = {
        id: content.izziSelection?.idPaquete,
        rpt: content.configuradorEntry?.rptCode,
        coverage: content.configuradorEntry?.coverageType
    } as unknown as PackageInfo;

    const shouldFetch = Boolean(content.userAnswers.tv || content.userAnswers.internet);

    const { data: ottsData, error: errorOtts, isLoading: loadingOtts } = useSWR(
        shouldFetch ? ['planes-extras', packageInfo] : null,
        fetchGetPackageInfo,
        {
            dedupingInterval: 3600000, // 1 hora
            revalidateOnFocus: false,
            keepPreviousData: true,
            revalidateIfStale: false,
        }
    );

    let planesExtras: OttProps[] | null = null;
    const dataOtts: PlanesTypes[] | undefined = rawData?.[0].fields.resources;

    if (ottsData && ottsData.extrasMap?.ott) {
        const planes: OttProps[] = ottsData.extrasMap.ott;

        planesExtras = planes?.filter(
            extra => extra.categoriaExtra?.toLowerCase().includes('netflix') ||
                extra.categoriaExtra?.toLowerCase().includes('disney+') ||
                extra.titulo?.toLowerCase().includes('vix premium') ||
                extra.titulo?.toLowerCase().includes('vix premium mundial')
        )
    }

    function handleSelect(card: OttProps) {

        setSelectedCard((prev) => {
            const cardSelected = prev.some(item => item.idExtra === card.idExtra);

            //---Deseleccionar
            if (cardSelected) {
                let newSelect = prev.filter(item => item.idExtra !== card.idExtra);

                //CASO VIX MUNDIAL
                if (card.titulo.toLowerCase() === 'vix premium') {
                    newSelect = newSelect.filter(item => item.titulo.toLowerCase() !== 'vix premium mundial')
                }

                return newSelect;
            }


            let newSelection = prev.filter(item => {
                const isVixCombo = (card.titulo.toLowerCase().includes('vix') && item.titulo.toLowerCase().includes('vix'));
                if (isVixCombo) return true;
                return item.grupo !== card.grupo && item.categoriaExtra !== card.categoriaExtra;
            }
            );

            //CASO VIX SLECCION
            if (card.titulo.toLowerCase() === 'vix premium mundial') {

                const hasVixPremium = planesExtras?.find(plan => plan.titulo.toLowerCase() === 'vix premium');

                const noSelectedVix = newSelection.filter(item => !item.titulo.toLowerCase().includes('vix'));

                if (hasVixPremium) {
                    return newSelection = [...noSelectedVix, hasVixPremium, card];
                } else {
                    newSelection = [...noSelectedVix, card];
                }
            }

            if (card.titulo.toLowerCase() === 'vix premium') {
                newSelection = newSelection.filter(item => item.titulo.toLowerCase() !== 'vix premium mundial');
            }
            return [...newSelection, card];
        });

    }

    useEffect(() => {
        const hasTv = Boolean(content.userAnswers.tv);
        const ottsPlanes = hasTv
            ? content.userAnswers.tv?.ott?.planes
            : content.userAnswers.internet?.ott?.planes;
        if (ottsPlanes && ottsPlanes.length > 0) {
            setSelectedCard(ottsPlanes);
        }
    }, [content.userAnswers.tv?.ott?.planes, content.userAnswers.internet?.ott?.planes, content.userAnswers.tv]);

    useEffect(() => {
        if (!planesExtras || planesExtras.length === 0) return;

        setSelectedCard((prev) => {
            const selectedTitles = new Set(prev.map(item => item.titulo));

            if (selectedTitles.has('ViX Premium Mundial')) {
                selectedTitles.add('Vix Premium')
            }

            const newSelect = planesExtras.filter(plan =>
                selectedTitles.has(plan.titulo)
            )

            const prevIds = prev.map(p => p.idExtra).sort().join(', ');
            const newIds = newSelect.map(p => p.idExtra).sort().join(', ');

            if (prevIds === newIds) return prev;
            return newSelect;
        });
    }, [planesExtras]);

    useEffect(() => {
        if (!selectedCard) return;

        content.setUserAnswers((prev) => {
            const hasTv = Boolean(prev.tv);
            const prevOTT = hasTv
                ? prev.tv?.ott?.planes ?? []
                : prev.internet?.ott?.planes ?? [];
            const prevIds = prevOTT.map((plan) => plan.idExtra).join(",");
            const newIds = selectedCard.map((plan) => plan.idExtra).join(",");

            if (prevIds === newIds) return prev;

            const total = selectedCard.reduce((acc, item) => acc + Number(item.costo), 0);

            if (hasTv) {
                return {
                    ...prev,
                    tv: {
                        ...prev.tv,
                        ott: { planes: selectedCard, total }
                    }
                };
            } else {
                return {
                    ...prev,
                    internet: {
                        ...prev.internet,
                        ott: { planes: selectedCard, total }
                    }
                };
            }
        });
    }, [content, selectedCard]);

    return (
        <Accordion
            showDivider={false}
            isCompact
            itemClasses={itemClasses}
            defaultSelectedKeys={"all"}
        >
            <AccordionItem
                key="1"
                aria-label="Accordion 1"
                title={configValue('configurador.tv.extras')}
                indicator={<DropIcon />}
            >
                {loadingOtts &&
                    <div className="flex justify-center py-[56px] w-full">
                        <div className="w-[104px] h-[104px]">
                            <LoaderIcon />
                        </div>
                    </div>
                }

                {errorOtts && (
                    <div className="py-8 text-center">
                        <div className="bg-red-100 text-red-700 px-4 py-2 rounded">
                            Ha surgido un error al traer la información solicitada.
                        </div>
                    </div>
                )}

                {!loadingOtts && !errorOtts && (!planesExtras || planesExtras.length === 0) && (
                    <div className="flex justify-center py-[56px] w-full">
                        <h1>De momento no fue posible cargar mas servicios</h1>
                    </div>
                )}

                {!loadingOtts && planesExtras && planesExtras.length > 0 && (
                    <div className="grid grid-cols-1 2xl:grid-cols-2 gap-[16px] 2xl:gap-[24px] auto-rows-fr">

                        {planesExtras && planesExtras.map((ott: OttProps, index: Key) => {
                            const isSelected = selectedCard.some(item => item.idExtra === ott.idExtra || item.titulo === ott.titulo);

                            const ottInfo = dataOtts?.find((info) => info.fields.valueLong === ott.nombreSiebel);
                            const duration = ottInfo?.fields.value ?? getValue('ott.duracionDefecto');

                            return (
                                <Card
                                    key={index}
                                    isPressable
                                    onPress={() => handleSelect(ott)}
                                    classNames={{
                                        base: "relative flex flex-row gap-[8px] rounded-md shadow-none h-full w-full bg-[#F5F6F8] items-center",
                                        header: "w-[96px] py-[17px] pl-[16px] pr-0",
                                        body: "w-auto py-[17px] px-0",
                                        footer: "w-fit py-[17px] pr-[16px] pl-0"
                                    }}
                                >
                                    <CardHeader>
                                        {(() => {
                                            const getIcon = ottsImages.find(icon =>
                                                ott.titulo.toLowerCase() === icon.fields.type.toLowerCase()
                                            );

                                            const setIcon = getIcon || ottsImages.find(icon =>
                                                ott.titulo.toLowerCase().includes(icon.fields.type.toLowerCase())
                                            )

                                            if (!setIcon) return null;

                                            return (
                                                <Image
                                                    style={{filter: `blur(${content.isLoading?"3":"0"}px)`}}
                                                    src={`https:${setIcon.fields.ottImage.fields.image.fields.file.url}`}
                                                    alt={setIcon.fields.ottImage.fields.altText || ott.titulo || "Ícono del servicio extra"}
                                                    width={96}
                                                    height={46}
                                                />
                                            )
                                        })()}
                                    </CardHeader>
                                    <CardBody>
                                        <div className="flex flex-col gap-[4px] text-xs md:text-sm leading-[16px] text-start justify-start">
                                            <h3 className="font-bold">{ott.titulo}</h3>
                                        </div>
                                    </CardBody>
                                    <CardFooter>
                                        <div className="flex flex-row gap-[8px] items-center justify-end pr-[4px]">
                                            <div className="flex flex-col gap-[4px]">
                                                <h3 className="font-bold text-base leading-[24px]">{`+${FormatCurrency(ott.costo)}`}</h3>
                                                <p className="font-normal text-sm leading-[16px]">{duration}</p>
                                            </div>
                                            <div
                                                className={`shrink-0 flex items-center justify-center w-[24px] h-[24px] rounded-md p-[1px] ${isSelected ? 'bg-conic-custom' : 'bg-gray-150'}`}
                                            >
                                                <span
                                                    className={`w-full h-full rounded-md flex items-center justify-center transition-colors ${isSelected ? 'bg-black-0' : 'bg-white-0'}`}
                                                    aria-pressed={isSelected}
                                                >
                                                    {isSelected && <CheckPlanesIcon className="w-[16px] h-[16px] text-white-0" />}
                                                </span>
                                            </div>
                                        </div>

                                    </CardFooter>
                                </Card>
                            )
                        })
                        }
                    </div>
                )
                }
            </AccordionItem >
        </Accordion >
    )
}
