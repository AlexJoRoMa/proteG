'use client';
import React from "react";
import {
  Button,
} from "@heroui/react";
import { useEffect, useState } from 'react';

const CookieConsent = () => {
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
                <p className="text-[18px]">antes de seguir navegando</p>
                <p className="text-sm text-gray-700">
                    izzi utiliza cookies propias y de terceros, así como los datos de conexión del cliente o usuario para conocer el operador de acceso y, en su caso, asociarlo a su condición de cliente izzi. Estas cookies serán utilizadas con la finalidad de gestionar y recabar información sobre la utilización del portal, mejorar nuestros servicios y mostrarte publicidad personalizada relacionada con tus preferencias en base a un perfil elaborado a partir de tus hábitos y el análisis de tu comportamiento dentro de la web (por ejemplo, secciones visitadas, consultas realizadas o links visitados). Pulsa “aceptar todas las cookies” o “rechazar cookies opcionales” si solo autorizas las esenciales para el funcionamiento de la web.
                </p>
                </div>
                <div className="justify-center items-center flex flex-col gap-2">
                <Button
                    className="w-full border border-black"
                    variant="bordered"
                    onPress={rejectCookies}
                >
                    rechazar cookies opcionales
                </Button>
                <Button
                    className="w-full bg-black text-white"
                    color="primary"
                    onPress={acceptCookies}
                >
                    aceptar todas las cookies
                </Button>
            </div>
        </div>
    </div>
    </>
  );
};

export default CookieConsent;