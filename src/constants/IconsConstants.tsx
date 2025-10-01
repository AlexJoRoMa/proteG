export const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => {
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

export const CheckPlanesIcon = (props: React.SVGProps<SVGSVGElement>) => {
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

export const LocationIcon = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="20" viewBox="0 0 16 20" fill="none">
        <path d="M8.0019 9.45851C8.4994 9.45851 8.92473 9.28135 9.2779 8.92701C9.63123 8.57268 9.8079 8.14676 9.8079 7.64926C9.8079 7.15176 9.63073 6.72635 9.2764 6.37301C8.92206 6.01985 8.49606 5.84326 7.9984 5.84326C7.5009 5.84326 7.07557 6.02043 6.7224 6.37476C6.36907 6.7291 6.1924 7.1551 6.1924 7.65276C6.1924 8.15026 6.36957 8.5756 6.7239 8.92876C7.07823 9.28193 7.50423 9.45851 8.0019 9.45851ZM8.00015 17.1068C9.95648 15.3554 11.4536 13.6756 12.4914 12.0673C13.5292 10.4589 14.0481 9.05026 14.0481 7.84126C14.0481 6.01826 13.469 4.5196 12.3106 3.34526C11.1523 2.17093 9.71548 1.58376 8.00015 1.58376C6.28481 1.58376 4.84798 2.17093 3.68965 3.34526C2.53131 4.5196 1.95215 6.01826 1.95215 7.84126C1.95215 9.05026 2.47107 10.4589 3.5089 12.0673C4.54673 13.6756 6.04381 15.3554 8.00015 17.1068ZM8.00015 19.1028C5.48348 16.9221 3.59631 14.8927 2.33865 13.0145C1.08098 11.1362 0.452148 9.41176 0.452148 7.84126C0.452148 5.5336 1.19857 3.66534 2.6914 2.23651C4.1844 0.807678 5.95398 0.0932617 8.00015 0.0932617C10.0463 0.0932617 11.8159 0.807678 13.3089 2.23651C14.8017 3.66534 15.5481 5.5336 15.5481 7.84126C15.5481 9.41176 14.9193 11.1362 13.6616 13.0145C12.404 14.8927 10.5168 16.9221 8.00015 19.1028Z" fill="black"/>
        </svg>
    );
};