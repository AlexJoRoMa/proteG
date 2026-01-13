/**
 * Normaliza un string de categoría removiendo espacios y convirtiéndolo a lowercase
 */
export function normalizeCategory(category: string): string {
    return category.replace(/\s+/g, '').toLowerCase();
}

/**
 * Obtiene las categorías de OTT válidas desde Contentful
 */
export async function getOttCategoriesFromContentful(): Promise<Set<string>> {
    try {
        const res = await fetch(`/api/microcopies?key=Configurador`);
        
        if (!res.ok) {
            console.error("Error al obtener microcopies desde Contentful");
            return new Set();
        }
        
        const data = await res.json();
        const resources = data?.[0]?.fields?.resources;
        
        if (!resources) return new Set();
        
        const categoryKeys = resources.filter((r: { fields: { key: string } }) => 
            r.fields.key.startsWith('packageInfo.isCombo.otts.categories')
        );
        
        // Extraer y normalizar las categorías
        const categories = new Set<string>();
        categoryKeys.forEach((item: { fields: { key: string, value: string } }) => {
            const normalizedCategory = normalizeCategory(item.fields.value);
            categories.add(normalizedCategory);
        });
        
        return categories;
    } catch (error) {
        console.error("Error al procesar categorías de OTT:", error);
        return new Set();
    }
}

/**
 * Verifica si una categoría de extra está en la lista de categorías válidas de combo
 */
export function isComboCategory(categoriaExtra: string | undefined, validCategories: Set<string>): boolean {
    if (!categoriaExtra) return false;
    const normalized = normalizeCategory(categoriaExtra);
    return validCategories.has(normalized);
}
