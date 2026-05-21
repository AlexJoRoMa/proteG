import { useIzziContent } from "@/components/providers/IzziProvider";
import { ArrowDownIcon, ArrowUpIcon, CircleCheckGreen } from "@/constants/IconsConstants";
import { ResumenData } from "@/types/ResumenCompra";
import { FormatCurrency } from "@/utils/Currency";
import { Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader, useDisclosure } from "@heroui/react";
import ResumenContent from "../resumenCompra/resumenContent";
import BannerPromocionesResumen from "@/components/atoms/BannerPromocionesResumen";
import BannerDomiciliacion from "@/components/atoms/bannerDomiciliacion";
import DetalleResumen from "../resumenCompra/detalleResumen";

export default function ResumenMobile({ resumenCopys, children }: { resumenCopys: ResumenData, children: () => React.ReactNode }) {

    const { precioTotal, globalUserAnswers, infoPaquetes, checkSwitch, checkedPromotions, ahorroTotal } = useIzziContent();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

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
                        (
                            <div className="flex gap-[4px] font-bold text-base">
                                <div className="flex gap-[4px]">
                                    <div className="w-[24px] h-[24px]">
                                        <CircleCheckGreen />
                                    </div>
                                    <h5>{resumenCopys.infoDrawer.ahorro}</h5>
                                </div>
                                <h5 className="text-right">{FormatCurrency(ahorroTotal)}</h5>
                            </div>
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
                                    <div className={`${(checkedPromotions && !checkSwitch) && "border-t-1 border-t-gray-150"}`}>
                                        <DetalleResumen
                                            copys={resumenCopys}
                                            userSelection={globalUserAnswers}
                                        />
                                    </div>
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