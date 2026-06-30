/* eslint-disable @typescript-eslint/no-unused-vars */
import { LoaderIcon } from "@/constants/IconsConstants";
import { ModalData } from "@/types/Contratacion";
import { Modal, ModalBody, ModalContent } from "@heroui/react";

type ModalContratacionProps = {
    isOpen: boolean;
    name: string | null;
    copys: ModalData
}

type ModalCopysProps = {
    titulo: string;
    subtitulo: string;
}

const getCopyByPath = (
    obj: ModalData,
    path: string | null
) => {
    if (!obj || !path) return null;
    const keys = path.split('.');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let current: any = obj;

    for (const key of keys) {
        if (!(key in current)) {
            return null;
        }
        current = current[key];
    }
    return current;
};

export default function ModalContratacion({ isOpen, name, copys }: ModalContratacionProps) {

    const modalCopy: ModalCopysProps = getCopyByPath(copys, name);

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

                                <>
                                    <div className="flex justify-center w-full">
                                        <div className="!w-[80px] !h-[80px]">
                                            <LoaderIcon />
                                        </div>
                                    </div>
                                    <div className="flex flex-col text-center gap-[24px] mt-[24px]">
                                        <h1 className="font-bold text-2xl xl:text-[32px] leading-[40px] text-nowrap">
                                            {modalCopy.titulo}
                                        </h1>
                                        <p className="font-normal text-lg xl:text-xl leading-[24px]">
                                            {modalCopy.subtitulo}
                                        </p>
                                    </div>
                                </>

                            </div>
                        </ModalBody>
                    )
                }
            </ModalContent>
        </Modal>
    )
}