export const CheckIcon = (props: any) => {
    return (
        <svg
            aria-hidden="true"
            fill="none"
            focusable="false"
            height="4px"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            viewBox="0 0 24 24"
            width="4px"
            {...props}
        >
            <polyline points="20 6 9 17 4 12" />
        </svg>
    );
};

export const CheckPlanesIcon = (props: any) => {
    return (
        <svg
            aria-hidden="true"
            fill="none"
            focusable="false"
            height="4px"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            viewBox="0 0 24 24"
            width="4px"
            {...props}
        >
            <polyline points="20 6 9 17 4 12" />
        </svg>
    );
};

export const DropIcon = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M19 9L12 15L5 9" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

export const Arrow = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 5L9 12L15 19" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}


export function LoaderIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="104"
            height="104"
            viewBox="0 0 104 104"
            fill="none"
            className="animate-spin"
        >
            <g clipPath="url(#paint0_angular_clip)" data-figma-skip-parse="true">
                <g transform="matrix(-0.0157486 -0.0496667 0.0496667 -0.0198184 52 52)">
                    <foreignObject x="-1375.25" y="-1375.25" width="2750.51" height="2750.51">
                        <div
                            style={{
                                width: "100%",
                                height: "100%",
                                background: "conic-gradient(from 90deg, rgba(164,87,158,1) 0deg, rgba(60,180,148,1) 86.5414deg, rgba(255,108,7,1) 179.071deg, rgba(205,50,163,1) 325.645deg, rgba(164,87,158,1) 360deg)",
                                opacity: 1,
                                borderRadius: "50%"
                            }}
                        />
                    </foreignObject>
                </g>
            </g>
            <path
                d="M104 52C104 80.7188 80.7188 104 52 104C23.2812 104 0 80.7188 0 52C0 23.2812 23.2812 0 52 0C80.7188 0 104 23.2812 104 52ZM7.8 52C7.8 76.411 27.589 96.2 52 96.2C76.411 96.2 96.2 76.411 96.2 52C96.2 27.589 76.411 7.8 52 7.8C27.589 7.8 7.8 27.589 7.8 52Z"
                data-figma-gradient-fill='{"type":"GRADIENT_ANGULAR","stops":[{"color":{"r":0.2364184707403183,"g":0.708909273147583,"b":0.5807761549949646,"a":1},"position":0.24039287865161896},{"color":{"r":1,"g":0.42352941632270813,"b":0.027450980618596077,"a":1},"position":0.49741816520690918},{"color":{"r":0.8075045347213745,"g":0.19629541039466858,"b":0.6400499939918518,"a":1},"position":0.9045683145523071}]}'
            />
            <defs>
                <clipPath id="paint0_angular_clip">
                    <path d="M104 52C104 80.7188 80.7188 104 52 104C23.2812 104 0 80.7188 0 52C0 23.2812 23.2812 0 52 0C80.7188 0 104 23.2812 104 52ZM7.8 52C7.8 76.411 27.589 96.2 52 96.2C76.411 96.2 96.2 76.411 96.2 52C96.2 27.589 76.411 7.8 52 7.8C27.589 7.8 7.8 27.589 7.8 52Z" />
                </clipPath>
            </defs>
        </svg>
    )
}