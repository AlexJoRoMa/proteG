import RecomendadorContent from "../molecules/recomendadorContent"

export default function Recomendador() {
    return (
        <div className="flex flex-col w-full bg-gray-50 py-[64px]">
            <div className="flex flex-col gap-[24px] self-center items-center pb-[40px]">
            <h1 className="font-bold leading-[48px] text-4xl">descubre la solución de internet perfecta para ti</h1>
            <h4 className="font-normal leading-[24px] text-xl">¿cuántas personas se conectan normalmente al internet de tu hogar?</h4>
            </div>
            <RecomendadorContent />
        </div>
    )
}