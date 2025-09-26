'use client'

import { CardDataFields, RecomendationCaseFields, StepsDataFields, UserAnswers } from "@/types/Recomendador";
import { useRecomendadorContent } from "@/utils/RecomendadorProvider";
import { Card, CardBody, CardFooter } from "@heroui/react";
import { Entry, EntrySkeletonType } from "contentful";
import Image from "next/image";
import { useState } from "react";
import RecomendadorSugestions from "./recomendadorSugestions";
import { CheckIcon } from "@/constants/IconsConstants";

export default function RecomendadorQuestionary() {

    const context = useRecomendadorContent();

    const stepsInfo = context.contentfulEntry?.fields.steps as unknown as EntrySkeletonType<StepsDataFields>[];
    const title = context.contentfulEntry?.fields.titleInicial as string;

    const casosNegocio = context.casosRecomendador as unknown as EntrySkeletonType<RecomendationCaseFields>[];

    const [actualStep, setActualStep] = useState<number>(0);
    const [isComplete, setIsComplete] = useState<boolean>(false);
    const { userAnswers, setUserAnswers, setRecomendation } = useRecomendadorContent();


    function handleNextStep(step: number) {
        let stepsMax = stepsInfo.length - 1;
        if (step === 0 || step < stepsMax) {
            setActualStep(step + 1);
            setIsComplete(false);
        } else if (step === stepsMax) {
            setRecomendation(validacionCasos(userAnswers, casosNegocio))
            setIsComplete(true);
        }
    }

    function userSelection(step: EntrySkeletonType<StepsDataFields>, card: EntrySkeletonType<CardDataFields>) {
        const isRadio = card.fields.type === 'radio';
        const questionTitle = step.fields.title;
        const optionTitle = card.fields.title;

        setUserAnswers((prev) => {
            const current = Array.isArray(prev[questionTitle]) ? prev[questionTitle] : [];

            if (isRadio) {
                return {
                    ...prev,
                    [questionTitle]: [optionTitle],
                };
            } else {
                const alreadySelected = current.includes(optionTitle);

                return {
                    ...prev,
                    [questionTitle]: alreadySelected ? current.filter((title) => title !== optionTitle) : [...current, optionTitle]
                }
            }
        })
    }

    function userNewSelection() {
        setUserAnswers({})
        setActualStep(0)
        setIsComplete(false)
    }

    function validacionCasos(userAnswers: UserAnswers, casos: EntrySkeletonType<RecomendationCaseFields>[]): string | null {
        for (const caso of casos) {

            const condicionesCumplidas = caso.fields.condiciones.every((condicion) => {
                const pregunta = condicion.fields.pregunta.trim().toLowerCase();
                const respuestasEsperadas = condicion.fields.respuestasEsperadas;
                const respuestasUsuario = userAnswers[pregunta] || [];

                return respuestasIguales(respuestasEsperadas, respuestasUsuario);
            });

            if (condicionesCumplidas) {
                return caso.fields.resultado
            }
        }
        return null;
    }

    function respuestasIguales(respuestasA: string[], respuestasB: string[]): boolean {
        const normalizar = (arr: string[]) => arr.map((r) => r.trim().toLowerCase()).sort();

        const a = normalizar(respuestasA);
        const b = normalizar(respuestasB);

        if (a.length !== b.length) {
            return false
        }

        return a.every((val, i) => val === b[i]);
    }

    function isStepAnswered(step: EntrySkeletonType<StepsDataFields>): boolean {
        const questionTitle = step.fields.title;
        const selected = userAnswers[questionTitle];

        return Array.isArray(selected) && selected.some(answ => answ.trim() !== '');
    }

    const currentStep = stepsInfo[actualStep];

    return (
        <>
            {!isComplete ?
                <div className="flex flex-col md:mx-md 2xl:mx-xl">
                    <div className="flex flex-col self-center items-center text-center pb-[40px] md:pb-[24px]">
                        <h1 className="font-semibold leading-[40px] md:leading-[48px] text-[32px] md:text-4xl">{title}</h1>
                    </div>
                    <div className="flex flex-col gap-[40px]">
                        <h1 className="font-normal leading-[24px] text-xl self-center text-center">{currentStep.fields.title}</h1>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px]">
                            {currentStep.fields.components.map((card: EntrySkeletonType<CardDataFields>) => {

                                const cardId = card as unknown as Entry<EntrySkeletonType<CardDataFields>>;
                                const questionTitle = currentStep.fields.title;
                                const selected = userAnswers[questionTitle] || [];
                                const isSelected = selected.includes(card.fields.title);

                                return (
                                    <div
                                        key={cardId.sys.id}
                                        className={`w-auto h-full rounded-md p-[2px] flex-col flex ${isSelected ? 'bg-[image:var(--gradient-card-border)]' : 'border border-gray-150'}`}
                                    >
                                        <Card
                                            isPressable
                                            onPress={() => userSelection(currentStep, card)}
                                            classNames={{
                                                base: "w-full h-full bg-gray-50 rounded-sm shadow-none",
                                                header: "pb-[16px]",
                                                footer: "justify-end"
                                            }}
                                        >
                                            <CardBody>
                                                <div className="flex flex-row items-stretch flex-1 h-full gap-[8px]">
                                                    <Image
                                                        className="w-[24px] h-[24px]"
                                                        src={`https:${card.fields.icon.fields.image.fields.file.url}`}
                                                        alt={card.fields.icon.fields.altText}
                                                        loading="lazy"
                                                        width={24}
                                                        height={24}
                                                    />
                                                    <h1 className="font-normal leading-[24px] text-base">{card.fields.title}</h1>
                                                </div>
                                            </CardBody>
                                            <CardFooter>
                                                <span
                                                    className={`w-[24px] h-[24px] ${card.fields.type === 'radio' ? 'rounded-full' : 'rounded-sm'} border flex items-center justify-center self-end transition-colors ${isSelected ? 'bg-black-0 border-black-0' : 'bg-transparent border-gray-150'}`}
                                                    aria-pressed={isSelected}
                                                >
                                                    {isSelected && <CheckIcon className="w-[16px] h-[16px] text-white-0" />}
                                                </span>
                                            </CardFooter>
                                        </Card>
                                    </div>
                                )
                            })
                            }
                        </div>
                        <button
                            className="py-[14px] px-[16px] border-1 border-black-0 rounded-md w-[320px] h-auto font-bold leading-[24px] text-lg self-center"
                            onClick={() => handleNextStep(actualStep)}
                            disabled={!isStepAnswered(currentStep)}
                        >
                            {stepsInfo[actualStep].fields.ctaText}
                        </button>
                    </div>
                </div>

                : <RecomendadorSugestions newSelectionAction={userNewSelection} />
            }
        </>
    )

}