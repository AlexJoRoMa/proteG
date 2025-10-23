import { IzziNavbar } from "@/types/headerTypes";

export const defaultLandingNavbar = 'Navbar Landing  noCombos';

export const getLandingNavbar = ( path: string, navbarContent: IzziNavbar[] ): string => {

    const cleanpath = path.replace(/^\/+|\/+$/g, '');

    const wCombo = navbarContent[0]?.fields.internalName;
    const noCombo = navbarContent[1]?.fields.internalName;

    const landingNavBar : Record<string, string> = {
        'landing/internet': noCombo,
        'landing/internettv': noCombo,
        'landing/tv': noCombo,
        'landing/movil': noCombo,
    
        'landing/internetmovil': wCombo,
        'landing/internettvmovil': wCombo
    };

    return landingNavBar[cleanpath] || defaultLandingNavbar;

}