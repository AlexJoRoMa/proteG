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
        "hover:bg-transparent",
        "border-1 border-solid rounded-md border-black-0",
        "group-data-[invalid=true]:!border-red-700",
        "group-data-[invalid=true]:!shadow-none"
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
        "data-[has-value=true]:border-black-0",
        "group-data-[invalid=true]:!border-red-700"

    ],
    errorMessage: "group-data-[invalid=true]:!text-red-700",
    value: "group-data-[invalid=true]:!text-gray-200",
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

export const AutoCompleteStyles = {
    base: "w-full",
    selectorButton: [
        "text-text-0",
        "text-xl",
        "data-[hover=true]:bg-transparent"
    ],
    popoverContent: [
        "border-1",
        "border-solid",
        "rounded-md",
        "border-black-0",
        "!px-0 !py-1",
    ],
}

export const AutoCompleteInputStyles = {
    classNames: {
        input: [
            "ml-1",
            "!cursor-pointer",
            "placeholder:!text-gray-200"
        ],
        inputWrapper: [
            "border-1",
            "border-solid",
            "rounded-md",
            "border-black-0",
            "!cursor-pointer",
            "group-data-[invalid=true]:!border-red-700"
        ],
        label: [
            "!text-black-0",
            "data-[invalid=true]:!text-black-0",
            "text-base xl:text-lg",
            "after:!text-black-0",
            "data-[invalid=true]:after:!text-black-0"
        ],
        errorMessage: [
            "text-sm",
            "!text-red-700"
        ]
    }
}