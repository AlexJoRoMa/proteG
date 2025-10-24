import { useMicrocopies } from "@/hooks/useMicrocopies";
import { Modal, ModalBody, ModalContent, useDisclosure } from "@heroui/react";

type ModalFechaInvalidaProps = {
    isOpen: boolean;
    setModal: () => void;
}
export default function ModalFechaInvalida({isOpen, setModal}: ModalFechaInvalidaProps) {

    const { getValue, isLoading, error } = useMicrocopies("modal-fechaInvalida");
    const { onClose } = useDisclosure();

    function handleClose() {
        setModal();
        onClose();
    }

    return (
        <>
            <Modal
                isOpen={isOpen}
                size="4xl"
                isDismissable={true}
                isKeyboardDismissDisabled={true}
                classNames={{
                    base: 'mx-0 rounded-none xl:rounded-md',
                    wrapper: 'w-full',
                    backdrop: `bg-black-0/80`,
                    body: "flex flex-col items-center mt-[24px] mb-[36px] xl:my-[65px] mx-[20px] xl:mx-[104px] p-0",
                }}
                closeButton={
                    <button onClick={handleClose} className="mt-[18px] xl:mt-0" role="button" tabIndex={0} aria-label="Close" type="button" data-react-aria-pressable="true">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                            <path d="M23.9999 8.00006L8 24M7.99993 8L23.9999 23.9999" stroke={"black"} strokeWidth="1.5" strokeLinecap="round"></path>
                        </svg>
                    </button>
                }
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
                                            <div className="flex flex-col text-start xl:text-center gap-[32px] items-center mt-0 xl:mt-[24px]">
                                                <h1 className="w-full font-bold xl:font-normal text-start xl:text-center text-xl xl:text-4xl leading-[48px] text-nowrap mt-0 xl:mt-[18px]">{getValue('titulo')}</h1>
                                                <p className="font-normal text-base leading-[24px]">{getValue('subtitulo')}</p>
                                                <button onClick={handleClose} className="mb-0 xl:mb-[18px] py-[14px] px-[16px] rounded-md bg-black-0 text-white-0 text-base xl:text-lg leading-[24px] font-semibold w-[256px] xl:w-[336px]">{getValue('boton')}</button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </ModalBody>
                        )
                    }
                </ModalContent>
            </Modal>

        </>
    )
}