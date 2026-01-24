'use client';
import React from "react";
import {
  Button,
} from "@heroui/react";
import { useEffect, useState } from 'react';
import { CookiesProps} from "@/types/Cookies";

const CookieConsent = ({title, long, aceptar, rechazar, cookieAcept, cookieAutoriza}: CookiesProps ) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'true');
    setVisible(false);
  };

  const rejectCookies = () => {
    setVisible(false);
  }

  if (!visible) return null;



  return (
    <>
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 shadow-lg p-4 z-50">
        <div className="mx-auto flex flex-col sm:flex-row justify-between gap-4">
            <div className="">
                <p className="text-[18px]">{title || 'titulo' }</p>
                <p className="text-sm text-gray-700">
                    <span>{long || 'long text'}</span>
                    <span className="underline">{cookieAcept || ''}</span>
                    <span >{cookieAutoriza || ''}</span>
                </p>
                </div>
                <div className="justify-center items-center flex flex-col gap-2">
                <Button
                    className="w-full border border-black"
                    variant="bordered"
                    onPress={rejectCookies}
                >
                    {rechazar || 'rechazar'}
                </Button>
                <Button
                    className="w-full bg-black text-white"
                    color="primary"
                    onPress={acceptCookies}
                >
                    {aceptar || 'aceptar'}
                </Button>
            </div>
        </div>
    </div>
    </>
  );
};

export default CookieConsent;