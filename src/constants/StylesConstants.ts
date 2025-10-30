export const inputStyles = {
    label: [
        "!text-black-0",
        "data-[invalid=true]:!text-black-0",
        "text-base xl:text-lg",
        "after:!text-black-0",
        "data-[invalid=true]:after:!text-black-0"
    ],
    inputWrapper: [
        "bg-transparent",
        "hover: bg-transparent",
        "border-1 border-solid rounded-md border-black-0",
        "data-[invalid=true]:!border-red-700",
        "data-[invalid=true]:!border-2",
        "data-[invalid=true]:!shadow-none"
    ],
    input: [
        "bg-transparent",
        "text-black-0",
        "placeholder:text-gray-200",
        "hover:bg-transparent",
    ],
    innerWrapper: [
        "bg-transparent",
    ],
    mainWrapper: [
        "mb-[16px]"
    ],
    errorMessage: [
        "text-sm",
        "!text-red-700"
    ]
}

export const SelectStyles = {
    label: [
        "!text-black-0",
        "data-[invalid=true]:!text-black-0",
        "text-base xl:text-lg",
        "after:!text-black-0",
        "data-[invalid=true]:after:!text-black-0"
    ],
    trigger: [
        "border-1",
        "border-solid",
        "rounded-md",
        "border-black-0",
        "transition-colors",
        "data-[has-value=true]:border-black-0"
    ],
    selectorIcon: "text-black-0 w-6 h-6",
    popoverContent: [
        "border-1",
        "border-solid",
        "rounded-md",
        "border-black-0",
        "!px-0 !py-1"
    ],
    listbox: [
        "p-0"
    ]
}