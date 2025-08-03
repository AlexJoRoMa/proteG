import { Modal, ModalBody, ModalContent } from '@heroui/react'
import React from 'react'

type ModalType = {
    isOpen: boolean;
    onOpenChange: () => void;
    children: React.ReactNode;
}


const ModalComponent = ({isOpen, onOpenChange, children}:ModalType) => {

  return (
    <>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior='inside' classNames={{backdrop: 'bg-black', closeButton: 'hover:bg-transparent active:bg-transparent absolute appearance-none cursor-pointer select-none top-1 end-1 p-2 text-foreground-500 rounded-full tap-highlight-transparent outline-hidden data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2'}} 
        closeButton={<button role="button" tabIndex={0} aria-label="Close" type="button" data-react-aria-pressable="true">
         <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M23.9999 8.00006L8 24M7.99993 8L23.9999 23.9999" stroke="white" strokeWidth="1.5" strokeLinecap="round"></path>
        </svg> </button>}>
            <ModalContent className="w-full h-full 2xl:w-[78vw] 2xl:h-[78vh] max-w-none max-h-none lg:rounded-md rounded-xl sm:my-0 sm:mx-0">
                {
                    () => (
                        <>
                            <ModalBody className='px-0 py-0'>
                                {children}
                            </ModalBody>
                        </>
                    )
                }
            </ModalContent>
        </Modal>
    </>
  )
}

export default ModalComponent
