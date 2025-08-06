

export default function LoaderIcon() {
    
    return (
        <div className="w-full h-auto flex justify-center">
            <div className="w-[80px] h-[80px] rounded-full p-[7px] bg-[image:var(--gradient-loader)] animate-spin">
                <div className="w-full h-full rounded-full bg-gray-50" />
            </div>
        </div>
    )
}