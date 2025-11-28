import { CURP_REGEX, PASSPORT_REGEX } from "@/constants/InputsConstants";

export function InputFilter(e: React.FormEvent<HTMLInputElement>, type: 'letras' | 'numeros' | 'alfanumerico') {
    const input = e.currentTarget;
    const value = input.value;

    let filtered = value;

    switch (type) {
        case 'letras':
            // Solo letras, acentos, Ñ y espacios
            filtered = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
            break;

        case 'numeros':
            // Solo números
            filtered = value.replace(/\D/g, '');
            break;

        case 'alfanumerico':
            // Letras, acentos y números, sin espacios
            filtered = value.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]/g, '');
            break;
    }

    if (filtered !== value) {
        const start = input.selectionStart || filtered.length;
        input.value = filtered;
        input.setSelectionRange(start, start);
    }
}

export function validatePassport(value: string) {
    const clean = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 13);
    const isValid = PASSPORT_REGEX.test(clean);
    return { clean, isValid };
};

export function validateCurp(value: string) {
    const clean = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 18);
    const isValid = CURP_REGEX.test(clean);
    return { clean, isValid };
};