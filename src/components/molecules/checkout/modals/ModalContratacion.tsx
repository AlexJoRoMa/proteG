import { LoaderIcon } from "@/constants/IconsConstants";
import { useMicrocopies } from "@/hooks/useMicrocopies";
import { Modal, ModalBody, ModalContent, useDisclosure } from "@heroui/react";

type ModalContratacionProps = {
    isOpen: boolean;
    name: string;
}

export default function ModalContratacion({ isOpen, name }: ModalContratacionProps) {

    const { getValue, isLoading, error } = useMicrocopies(name);

    return (
        <Modal
            isOpen={isOpen}
            size="2xl"
            placement="center"
            hideCloseButton={true}
            isDismissable={false}
            isKeyboardDismissDisabled={false}
            classNames={{
                base: 'mx-[16px] xl:mx-0 !rounded-md',
                wrapper: 'w-full',
                backdrop: `bg-black-0/80`,
                body: "flex flex-col items-center my-[48px] mx-[24px] p-0",
            }}
        >
            <ModalContent>
                {
                    () => (
                        <ModalBody>
                            <div className="w-full">
                                {isLoading && <div className="py-8 text-center">Cargando...</div>}

                                {
                                    error && (
                                        <div className="py-8 text-center">
                                            <div className="bg-red-100 text-red-700 px-4 py-2 rounded">
                                                Ha surgido un error al traer la información solicitada.
                                            </div>
                                        </div>
                                    )
                                }

                                {!isLoading && !error && (
                                    <>
                                        <div className="flex justify-center w-full">
                                            <div className="!w-[80px] !h-[80px]">
                                                <LoaderIcon />
                                            </div>
                                        </div>
                                        <div className="flex flex-col text-center gap-[24px] mt-[24px]">
                                            <h1 className="font-bold text-2xl xl:text-[32px] leading-[40px] text-nowrap">{getValue('titulo')}</h1>
                                            <p className="font-normal text-lg xl:text-xl leading-[24px]">{getValue('subtitulo')}</p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </ModalBody>
                    )
                }
            </ModalContent>
        </Modal>
    )
}