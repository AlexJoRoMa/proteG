/* eslint-disable @typescript-eslint/no-explicit-any */
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

export const CheckStepIcon = (props: any) => {
    return (
        <svg
            aria-hidden="true"
            fill="none"
            focusable="false"
            height="18px"
            stroke="white"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            viewBox="0 0 24 24"
            width="18px"
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
            width="100%"
            height="100%"
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
            <path d="M8.0019 9.45851C8.4994 9.45851 8.92473 9.28135 9.2779 8.92701C9.63123 8.57268 9.8079 8.14676 9.8079 7.64926C9.8079 7.15176 9.63073 6.72635 9.2764 6.37301C8.92206 6.01985 8.49606 5.84326 7.9984 5.84326C7.5009 5.84326 7.07557 6.02043 6.7224 6.37476C6.36907 6.7291 6.1924 7.1551 6.1924 7.65276C6.1924 8.15026 6.36957 8.5756 6.7239 8.92876C7.07823 9.28193 7.50423 9.45851 8.0019 9.45851ZM8.00015 17.1068C9.95648 15.3554 11.4536 13.6756 12.4914 12.0673C13.5292 10.4589 14.0481 9.05026 14.0481 7.84126C14.0481 6.01826 13.469 4.5196 12.3106 3.34526C11.1523 2.17093 9.71548 1.58376 8.00015 1.58376C6.28481 1.58376 4.84798 2.17093 3.68965 3.34526C2.53131 4.5196 1.95215 6.01826 1.95215 7.84126C1.95215 9.05026 2.47107 10.4589 3.5089 12.0673C4.54673 13.6756 6.04381 15.3554 8.00015 17.1068ZM8.00015 19.1028C5.48348 16.9221 3.59631 14.8927 2.33865 13.0145C1.08098 11.1362 0.452148 9.41176 0.452148 7.84126C0.452148 5.5336 1.19857 3.66534 2.6914 2.23651C4.1844 0.807678 5.95398 0.0932617 8.00015 0.0932617C10.0463 0.0932617 11.8159 0.807678 13.3089 2.23651C14.8017 3.66534 15.5481 5.5336 15.5481 7.84126C15.5481 9.41176 14.9193 11.1362 13.6616 13.0145C12.404 14.8927 10.5168 16.9221 8.00015 19.1028Z" fill="black" />
        </svg>
    );
};

export const EditIcon = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="27" viewBox="0 0 28 27" fill="none" className='md:hidden ml-auto'>
            <path d="M0.666992 26.9997V24.333H27.3337V26.9997H0.666992ZM6.00033 17.4357H7.43099L19.1643
                    5.70999L18.4543 4.97399L17.726 4.27133L6.00033 16.0047V17.4357ZM4.66699 18.769V15.4357L19.626 
                    0.484326C19.7678 0.342326 19.9229 0.238882 20.0913 0.173993C20.2598 0.109104 20.4313 0.0766602 
                    20.606 0.0766602C20.7807 0.0766602 20.9499 0.109104 21.1137 0.173993C21.2774 0.238882 21.4328 
                    0.344883 21.5797 0.491994L22.9517 1.87133C23.0985 2.01333 23.2032 2.16688 23.2657 2.33199C23.3281 
                    2.49733 23.3593 2.66811 23.3593 2.84433C23.3593 3.00944 23.3268 3.17755 23.2617 3.34866C23.1968 3.51977 
                    23.0934 3.6761 22.9517 3.81766L8.00033 18.769H4.66699ZM19.1643 5.70999L18.4543 4.97399L17.726 
                    4.27133L19.1643 5.70999Z" fill="#1C1B1F" />
        </svg>
    )
}

export const UploadICon = () => {
    return (
        <svg className='self-center' width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 9.00195C19.175 9.01406 20.3529 9.11051 21.1213 9.8789C22 10.7576 22 12.1718 22 15.0002V16.0002C22 18.8286 
        22 20.2429 21.1213 21.1215C20.2426 22.0002 18.8284 22.0002 16 22.0002H8C5.17157 22.0002 3.75736 22.0002 2.87868 
        21.1215C2 20.2429 2 18.8286 2 16.0002L2 15.0002C2 12.1718 2 10.7576 2.87868 9.87889C3.64706 9.11051 4.82497 9.01406 
        7 9.00195" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M12 15L12 2M12 2L15 5.5M12 2L9 5.5" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

export const DeleteIcon = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M20.5001 6H3.5" stroke="#A8071A" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M18.8346 8.5L18.3747 15.3991C18.1977 18.054 18.1092 19.3815 17.2442 20.1907C16.3792 21 15.0488 21 12.388 21H11.6146C8.95382 21 7.62342 21 6.75841 20.1907C5.8934 19.3815 5.8049 18.054 5.62791 15.3991L5.16797 8.5" stroke="#A8071A" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M9.5 11L10 16" stroke="#A8071A" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M14.5 11L14 16" stroke="#A8071A" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M6.5 6C6.55588 6 6.58382 6 6.60915 5.99936C7.43259 5.97849 8.15902 5.45491 8.43922 4.68032C8.44784 4.65649 8.45667 4.62999 8.47434 4.57697L8.57143 4.28571C8.65431 4.03708 8.69575 3.91276 8.75071 3.8072C8.97001 3.38607 9.37574 3.09364 9.84461 3.01877C9.96213 3 10.0932 3 10.3553 3H13.6447C13.9068 3 14.0379 3 14.1554 3.01877C14.6243 3.09364 15.03 3.38607 15.2493 3.8072C15.3043 3.91276 15.3457 4.03708 15.4286 4.28571L15.5257 4.57697C15.5433 4.62992 15.5522 4.65651 15.5608 4.68032C15.841 5.45491 16.5674 5.97849 17.3909 5.99936C17.4162 6 17.4441 6 17.5 6" stroke="#A8071A" strokeWidth="1.5" />
        </svg>
    )
}

export const PagoEfectivoIcon = () => {
    return (
        <svg className='mb-7 mx-auto' width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
            <mask id="mask0_7202_59978" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="0" width="56" height="56">
                <rect width="56" height="56" fill="#D9D9D9" />
            </mask>
            <g mask="url(#mask0_7202_59978)">
                <path d="M31.4993 28.987C30.1829 28.987 29.0762 28.5384 28.179 27.6412C27.2814 26.7437 26.8327 25.6367 26.8327 24.3203C26.8327 23.0043 27.2814 21.8976 28.179 21C29.0762 20.1024 30.1829 19.6537 31.4993 19.6537C32.8157 19.6537 33.9225 20.1024 34.8197 21C35.7172 21.8976 36.166 23.0043 36.166 24.3203C36.166 25.6367 35.7172 26.7437 34.8197 27.6412C33.9225 28.5384 32.8157 28.987 31.4993 28.987ZM17.0507 36.4362C16.014 36.4362 15.1265 36.0669 14.3884 35.3284C13.6503 34.5903 13.2812 33.7031 13.2812 32.6667V15.9746C13.2812 14.9378 13.6503 14.0504 14.3884 13.3122C15.1265 12.5741 16.014 12.2051 17.0507 12.2051H45.9479C46.9847 12.2051 47.8721 12.5741 48.6102 13.3122C49.3484 14.0504 49.7174 14.9378 49.7174 15.9746V32.6667C49.7174 33.7031 49.3484 34.5903 48.6102 35.3284C47.8721 36.0669 46.9847 36.4362 45.9479 36.4362H17.0507ZM19.3841 34.1028H43.6146C43.6146 33.0587 43.9836 32.1693 44.7217 31.4347C45.4599 30.7004 46.3473 30.3333 47.3841 30.3333V18.3079C46.3399 18.3079 45.4507 17.9389 44.7165 17.2007C43.9819 16.4622 43.6146 15.5748 43.6146 14.5384H19.3841C19.3841 15.5826 19.015 16.4718 18.2769 17.206C17.5388 17.9406 16.6514 18.3079 15.6146 18.3079V30.3333C16.6587 30.3333 17.5479 30.7024 18.2822 31.4405C19.0168 32.1786 19.3841 33.0661 19.3841 34.1028ZM42.8072 43.4362H10.0507C9.01397 43.4362 8.12653 43.0669 7.38842 42.3284C6.65031 41.5903 6.28125 40.7031 6.28125 39.6667V19.1152H8.61458V39.6667C8.61458 40.0256 8.76411 40.3546 9.06317 40.6537C9.36261 40.9531 9.69181 41.1028 10.0507 41.1028H42.8072V43.4362ZM17.0507 34.1028H15.6146V14.5384H17.0507C16.6619 14.5384 16.3253 14.6806 16.041 14.9648C15.7567 15.2491 15.6146 15.5857 15.6146 15.9746V32.6667C15.6146 33.0556 15.7567 33.3921 16.041 33.6764C16.3253 33.9607 16.6619 34.1028 17.0507 34.1028Z" fill="#1C1B1F" />
            </g>
        </svg>
    )
}

export const ArrowUpIcon = (props: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
            <path d="M19 15L12 9L5 15" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

export const ArrowDownIcon = (props: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
            <path d="M19 9L12 15L5 9" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

export const CloseIcon = (props: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
            <path d="M18 6.00005L6 18M5.99995 6L17.9999 18" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    )
}