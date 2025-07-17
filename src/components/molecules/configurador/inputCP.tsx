'use client'

import { useContent } from "@/utils/ConfiguradorProvider";
import { useState } from "react";

export default function InputCP() {

    const content = useContent();
    const codigoPostal = content.coberturaCopy.codigoPostal;


    const [value, setValue] = useState("");
    const [error, setError] = useState("");

    const validateEntry = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        if (/^\d*$/.test(newValue)) {
            setValue(newValue);
            setError("");
        }
    };

    const validateValidEntry = () => {
        if (value === " " || value.length < 5) {
            setError("Es necesario que introduzcas un código postal")
        } else if (!/^\d*$/.test(value)) {
            setError("Código postal invalido. Introduce un código postal válido")
        } else {
            setError("");
        }
    };

    const onSubmit = (e: any) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.currentTarget));
    }

    return (
        <div className="w-full">
            <form className="w-full flex flex-row gap-[16px]" onSubmit={onSubmit}>
                <div className="flex flex-col gap-[8px] w-full">
                    <label htmlFor="postalcode" className="text-base leading-[24px] font-normal">{codigoPostal.label}</label>
                    <input
                        name="postalcode"
                        placeholder={codigoPostal.placeHolder}
                        type="text"
                        id="postalcode"
                        className={`border border-black-0 ${error && "border-red-700 focus-visible:outline-red-700 focus-visible:outline-0 text-red-700"} rounded-sm pt-[12px] pr-[8px] pb-[9px] pl-[16px] font-normal leading-[24px] text-base text-black-0 focus-visible:outline-black-0 focus-visible:outline-0`}
                        maxLength={5}
                        value={value}
                        onChange={validateEntry}
                        onBlur={validateValidEntry}
                    />

                </div>
                <button
                    type="submit"
                    className="rounded-sm bg-black-0 text-white-0 py-[12px] px-[16px] font-bold text-base leading-[24px] mt-[29px]"
                    onClick={() => console.log('click!!!')}
                >
                    {codigoPostal.button}
                </button>
            </form>
            {error && <p className="font-normal leading-[16px] text-sm text-red-700 pt-[5px]">{error}</p>}
        </div>


    )
}