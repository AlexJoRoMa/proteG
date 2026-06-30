import { useThankYou } from "@/components/providers/ThankYouProvider";
import { DropIcon } from "@/constants/IconsConstants";
import { ResumenData } from "@/types/ResumenCompra";
import { ThankyouCopys } from "@/types/ThankyouTypes";
import { Accordion, AccordionItem, Card, CardBody } from "@heroui/react";
import ResumenContent from "../resumenCompra/resumenContent";
import DetalleResumen from "../resumenCompra/detalleResumen";
import { useIzziContent } from "@/components/providers/IzziProvider";

export default function ResumenMobile() {

    const { copys, copyResumen } = useThankYou();
    const { globalUserAnswers } = useIzziContent();

    const copy = copys as ThankyouCopys;
    const resumenCopys = copyResumen as ResumenData;

    const itemClasses = {
        indicator: "data-[open=true]:rotate-180",
        title: "leading-[24px] font-normal text-base",
        trigger: "pb-[24px] data-[open=true]:pb-0"
    }

    return (
        <>
            <Accordion
                showDivider={false}
                isCompact
                itemClasses={itemClasses}
            >
                <AccordionItem
                    key="1"
                    aria-label="Accordion 1"
                    title={copy.resumen}
                    indicator={<DropIcon />}
                >

                    <Card
                        key="1"
                        classNames={{
                            base: "relative flex flex-row gap-[8px] rounded-md shadow-none h-full w-full items-center",
                            body: "w-auto py-0 px-0",
                        }}
                    >
                        <CardBody>
                            <>
                                <ResumenContent
                                    copys={resumenCopys}
                                    userSelection={globalUserAnswers}
                                />
                                <div className="border-t-1 border-t-gray-150">
                                    <DetalleResumen
                                        copys={resumenCopys}
                                        userSelection={globalUserAnswers}
                                    />
                                </div>
                            </>
                        </CardBody>
                    </Card>
                </AccordionItem>
            </Accordion >

        </>
    )
}