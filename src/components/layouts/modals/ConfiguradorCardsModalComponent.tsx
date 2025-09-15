import { ConfiguradorCardsModalProps, IconProps, ModalData } from "@/types/ModalComponentTypes";
import { FormatCurrency } from "@/utils/Currency";
import { dataModel } from "@/utils/modal/ConfiguradorDataModal";
import { Button } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";

const fetchMicrocopies = async (key: string) => {
    const res = await fetch(`/api/microcopies?key=${key}`);
    if (!res.ok) throw new Error("Error al obtener los microcopies desde Contentful");
    return res.json();
};

const fetchMediaBlocks = async (key: string) => {
    const res = await fetch(`/api/configurador/modal?key=${key}`);
    if (!res.ok) throw new Error("Error al obtener los medias desde Contentful");
    return res.json();
};


const ConfiguradorCardsModalComponent = ({ modalData, onClose, variables, type }: ConfiguradorCardsModalProps & { onClose?: () => void }) => {
    return <ConfiguradorCardsModalContent modalData={modalData} onClose={onClose} variables={variables} type={type} />;
};

const ConfiguradorCardsModalContent = ({ modalData, onClose, variables, type }: ConfiguradorCardsModalProps & { onClose?: () => void }) => {

    // Usar SWR para el fetching con caché optimizado
    const { data: contentfulData, error: contentfulError, isLoading: contentfulLoading } = useSWR(
        ['microcopies', type],
        () => fetchMicrocopies(`modal-configurador-${type}`),
    );

    const { data: icons, error: errorIcons, isLoading: loadingIcons } = useSWR(
        ['icons', type],
        () => fetchMediaBlocks(type),
    );

    const contentfulIcons = icons?.items as IconProps[];

    // Helper para encontrar valores por key
    const getValueByKey = (key: string) => {

        if (!contentfulData || !Array.isArray(contentfulData) || !contentfulData[0]?.fields?.resources) {
            return '';
        }

        const item = contentfulData[0].fields.resources.find((item: { fields: { key: string; value: string } }) =>
            item.fields?.key === key
        );

        return item?.fields?.value || '';
    };

    const model = dataModel(getValueByKey);
    const data = model[type];
    const borderClasses = {
        internet: "border-b-orange-400",
        movil: "border-b-magenta-400",
        tv: "border-b-cyan-400"
    }

    const finalData: ModalData | undefined = modalData || data;
    const durationPromo = variables.periodo || finalData.periodo;
    const domicilioPromo = variables.domicilio || Number(finalData.domicilio);

    let headerContent;
    let bodyContent;

    switch (type) {
        case "internet":
            headerContent =
                <>
                    {finalData.header.titulo.preVelocidadMinima}{" "}
                    <span>{variables.velocidadMinima}</span>{" "}
                    {finalData.header.titulo.posVelocidasMinima}{" "}
                    <span className="font-bold">{variables.velocidadMaxima}</span>{" "}
                    <span className="font-bold">{finalData.header.titulo.unidadVelocidad}</span>{" "}
                    {finalData.header.titulo.posVelocidadMaxima}{" "}
                    <span>{durationPromo}</span>{" "}
                    <span>{finalData.header.titulo.meses}</span>
                </>
            bodyContent =
                <>
                    {finalData.body.texto1}&nbsp;
                    <span className="font-bold">{finalData.body.textoPromocion1}</span>&nbsp;
                    <span className="font-bold">{FormatCurrency(variables.precioAhorro)}</span>&nbsp;
                    <span className="font-bold">{finalData.body.textoPromocion2}</span>&nbsp;
                    <span>{finalData.body.texto2}</span>&nbsp;
                    <span className="font-bold">{finalData.body.textoDomicilio}</span>&nbsp;
                    <span>{finalData.body.texto3}</span>&nbsp;
                    <span className="font-bold">{finalData.body.textoPromocion3}</span>&nbsp;
                    <span className="font-bold">{FormatCurrency(domicilioPromo)}</span>
                    <span>{finalData.body.texto4}</span>
                </>
            break;

        case "tv":
            headerContent =
                <>
                    {finalData.header.titulo.preCanales}{" "}
                    <span className="font-bold">{variables.canales}</span>{" "}
                    <span className="font-bold">{finalData.header.titulo.posCanales}</span>
                </>

            bodyContent =
                <>
                    {finalData.body.texto1}&nbsp;
                    {durationPromo}&nbsp;
                    {variables.periodo}&nbsp;
                    <span>{finalData.body.texto2}</span>&nbsp;
                </>
            break;

        case "movil":
            headerContent =
                <>
                    {finalData.header.titulo.preVelocidad}{" "}
                    <span className="font-bold">{variables.velocidadMaxima}</span>{" "}
                    <span className="font-bold">{finalData.header.titulo.posVelocidad}</span>
                </>

            bodyContent =
                <>
                    {finalData.body.texto1}&nbsp;
                    {durationPromo}&nbsp;
                    {variables.periodo}&nbsp;
                    <span>{finalData.body.texto2}</span>&nbsp;
                </>
            break;

        default:
            break;
    }

    if (!finalData || !finalData.header) {
        return (
            <div className="py-8 text-center">
                <h1 className="text-gray-500">
                    No hay informacion disponible para esta selección.
                </h1>
            </div>
        )
    }

    return (
        <div className='flex flex-col xl:p-14 pt-[72px] pb-[56px] px-[16px]'>
            {contentfulLoading && loadingIcons && !modalData && (
                <div className="py-8 text-center">
                    <div className="text-gray-500">Cargando...</div>
                </div>
            )}
            {contentfulError && errorIcons && !modalData && (
                <div className="py-8 text-center">
                    <div className="bg-red-100 text-red-700 px-4 py-2 rounded">
                        Ha surgido un error al traer la información solicitada.
                    </div>
                </div>
            )}
            {(!contentfulLoading || !loadingIcons || modalData) && (
                <>
                    <div className={`flex flex-col xl:flex-row xl:items-end pb-[8px] justify-between border-b-1 ${borderClasses[type]}`}>
                        <>
                            <div className="flex flex-col gap-[16px] w-full">
                                <div className="flex flex-row gap-[8px]">
                                    {contentfulIcons?.[0] && (
                                        <Image
                                            className="h-[32px] w-[32px]"
                                            src={`https:${contentfulIcons[0].fields.image.fields.file.url}`}
                                            alt={contentfulIcons[0].fields.altText}
                                            width={contentfulIcons[0].fields.image.fields.file.details.image.width}
                                            height={contentfulIcons[0].fields.image.fields.file.details.image.height}
                                        />
                                    )}
                                    <h3 className='text-[18px] xl:text-2xl w-[60%] xl:w-full mr-0 xl:text-start xl:font-normal'>
                                        {finalData.titulo}
                                    </h3>
                                </div>
                                <p className="text-[32px] font-normal break-normal whitespace-normal !max-w-full">
                                    {headerContent}
                                </p>
                            </div>
                        </>
                        <div className="inline-flex self-start xl:self-end font-normal text-lg items-baseline gap-1 whitespace-nowrap">
                            <h5>{finalData.header.precio.prePrecio}</h5>
                            <h3 className="font-bold text-[48px] xl:text-[56px]">{FormatCurrency(variables.precioAhorro)}</h3>
                            <h5>{finalData.header.precio.posPrecio}</h5>
                        </div>
                    </div>

                    <div className="flex flex-col gap-[24px] mb-[32px] mt-[24px] text-base">
                        <p>
                            {bodyContent}
                        </p>
                        <div className="flex flex-row gap-[8px]">
                            {contentfulIcons?.[1] && (
                                <Image
                                    className="h-[32px] w-[32px]"
                                    src={`https:${contentfulIcons[1].fields.image.fields.file.url}`}
                                    alt={contentfulIcons[1].fields.altText}
                                    width={contentfulIcons[1].fields.image.fields.file.details.image.width}
                                    height={contentfulIcons[1].fields.image.fields.file.details.image.height}
                                />
                            )}
                            <div>
                                <p className="font-bold">{finalData.body.beneficios.titulo1}</p>
                                <p>{finalData.body.beneficios.descripcion1}</p>
                            </div>
                        </div>
                        <div className="flex flex-row gap-[8px]">
                            {contentfulIcons?.[2] && (
                                <Image
                                    className="h-[32px] w-[32px]"
                                    src={`https:${contentfulIcons[2].fields.image.fields.file.url}`}
                                    alt={contentfulIcons[2].fields.altText}
                                    width={contentfulIcons[2].fields.image.fields.file.details.image.width}
                                    height={contentfulIcons[2].fields.image.fields.file.details.image.height}
                                />
                            )}
                            <div>
                                <p className="font-bold">{finalData.body.beneficios.titulo2}</p>
                                <p>{finalData.body.beneficios.descripcion2}</p>
                            </div>
                        </div>
                    </div>

                    <Button
                        className='bg-black w-[260px] mx-auto xl:mr-auto md:w-[320px] text-white font-bold h-[48px] text-[16px] leading-[24px] rounded-md mb-[32px]'
                        onPress={onClose}
                    >
                        {finalData.body.textoBoton}
                    </Button>

                    <div className="flex flex-row gap-[4px] text-xs xl:text-base font-normal">
                        <p>
                            <Link
                                href={finalData.footer.terminos.url}
                                className="font-bold underline"
                            >
                                {finalData.footer.terminos.texto}
                            </Link>&nbsp;
                            <span>{finalData.footer.descripcion}</span>
                        </p>
                    </div>
                </>
            )}
        </div>
    )
}

export default ConfiguradorCardsModalComponent;