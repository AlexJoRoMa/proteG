import { useIzziContent } from "@/components/providers/IzziProvider";
import { ArrowDownIcon, ArrowUpIcon } from "@/constants/IconsConstants";
import { ResumenData } from "@/types/ResumenCompra";
import { FormatCurrency } from "@/utils/Currency";
import { Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader, useDisclosure } from "@heroui/react";
import ResumenContent from "../resumenCompra/resumenContent";
import { internetComponentFields, tvComponentFields } from "@/types/ConfiguradorTypes";
import BannerPromocionesResumen from "@/components/atoms/BannerPromocionesResumen";
import BannerDomiciliacion from "@/components/atoms/bannerDomiciliacion";
import DetalleResumen from "../resumenCompra/detalleResumen";

export default function ResumenMobile({ resumenCopys, children }: { resumenCopys: ResumenData, children: () => React.ReactNode }) {

    const { precioTotal, precioCombinado, globalUserAnswers, infoPaquetes, checkSwitch, checkedPromotions } = useIzziContent();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const internet = globalUserAnswers.internet as unknown as internetComponentFields | undefined;
    const tv = globalUserAnswers.tv as unknown as tvComponentFields | undefined;

    return (
        <>
            <div className="flex justify-between mb-[16px]">
                <div className="flex flex-col gap-[8px]">
                    <div className="flex gap-[4px] font-normal text-base leading-[24px] text-gray-500 items-baseline">
                        <h3 className="font-extrabold text-[32px] leading-[32px] text-black-0">
                            {FormatCurrency(precioTotal)}
                        </h3>
                        <h5>{resumenCopys.infoDrawer.plazo}</h5>
                        <p>|</p>
                        <h5 className="font-bold">{infoPaquetes}</h5>
                    </div>

                    {
                        ((internet && tv) ?
                            (
                                <div className="flex gap-[4px] font-bold">
                                    <h5>
                                        {resumenCopys.informacion.promociones}
                                    </h5>
                                    <p className="text-green-700">
                                        {FormatCurrency(precioCombinado)}
                                    </p>
                                </div>
                            ) :
                            (
                                <h5 className="font-bold">
                                    {resumenCopys.informacion.combinaciones}
                                </h5>
                            )
                        )
                    }
                </div>

                <button
                    className="w-[40px] h-[40px] rounded-full border-2 border-black-0 flex items-center justify-center"
                    onClick={onOpen}
                >
                    <ArrowUpIcon />
                </button>
            </div>

            <div className="z-50">
                {children()}
            </div>


            {/* Drawer Mobile */}

            <Drawer
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                size="2xl"
                placement="bottom"
                hideCloseButton
                classNames={{
                    header: "px-[16px] py-[24px]",
                    body: "px-[16px] py-0 gap-0",
                    footer: "w-full px-[16px] pt-0 bottom-0 z-50"
                }}
            >
                <DrawerContent>
                    {(onClose) => (
                        <>
                            <DrawerHeader
                                className="flex flex-row justify-between items-center"
                            >
                                <h3 className="font-bold text-xl leading-[24px] text-[#11181C]">{resumenCopys.titulo}</h3>
                                <button
                                    className="w-[40px] h-[40px] rounded-full border-2 border-black-0 flex items-center justify-center"
                                    onClick={onClose}
                                >
                                    <ArrowDownIcon />
                                </button>
                            </DrawerHeader>

                            <DrawerBody>
                                <>
                                    <BannerPromocionesResumen
                                        copys={resumenCopys}
                                    />
                                    <ResumenContent
                                        copys={resumenCopys}
                                        userSelection={globalUserAnswers}
                                    />
                                    {
                                        (checkedPromotions && !checkSwitch) && (
                                            <div className="mb-[20px]">
                                                <BannerDomiciliacion
                                                    copys={resumenCopys}
                                                />
                                            </div>
                                        )
                                    }
                                    <DetalleResumen 
                                    copys={resumenCopys}
                                    userSelection={globalUserAnswers}
                                    />
                                </>
                            </DrawerBody>

                            <DrawerFooter>
                                {children()}
                            </DrawerFooter>
                        </>
                    )}
                </DrawerContent>
            </Drawer>

        </>


    )
}