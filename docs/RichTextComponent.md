# RichTextComponent

Un componente de React para renderizar contenido rich text de Contentful en tu aplicación Next.js.

## Características

- ✅ Renderizado completo de contenido rich text de Contentful
- ✅ Soporte para imágenes incrustadas y assets
- ✅ Soporte para entradas incrustadas
- ✅ Estilos personalizables con Tailwind CSS
- ✅ TypeScript completamente tipado
- ✅ Manejo de enlaces externos
- ✅ Soporte para todos los elementos de texto (headings, párrafos, listas, citas, etc.)
- ✅ Pruebas unitarias incluidas

## Instalación

Las dependencias necesarias ya están instaladas:

```bash
npm install @contentful/rich-text-react-renderer @contentful/rich-text-types
```

## Uso Básico

```tsx
import RichTextComponent from '@/components/molecules/RichTextComponent';
import { Document } from '@contentful/rich-text-types';

// En tu componente
function MyPage({ contentfulData }: { contentfulData: any }) {
  const richTextDocument = contentfulData.fields.description as Document;

  return (
    <div>
      <RichTextComponent 
        document={richTextDocument}
        className="prose prose-lg max-w-none"
      />
    </div>
  );
}
```

## Uso con Contentful Client

```tsx
import { contentfulClient } from '@/services/contentful/client';
import RichTextComponent from '@/components/molecules/RichTextComponent';
import { Document } from '@contentful/rich-text-types';

async function fetchContent(entryId: string) {
  const entry = await contentfulClient.getEntry(entryId);
  return entry.fields.richTextField as Document;
}

function ContentPage() {
  const [content, setContent] = useState<Document | null>(null);

  useEffect(() => {
    fetchContent('your-entry-id').then(setContent);
  }, []);

  if (!content) return <div>Cargando...</div>;

  return (
    <RichTextComponent 
      document={content}
      className="my-custom-styles"
    />
  );
}
```

## Props

| Prop | Tipo | Descripción | Default |
|------|------|-------------|---------|
| `document` | `Document` | El documento rich text de Contentful | Requerido |
| `className` | `string` | Clases CSS adicionales para el contenedor | `''` |

## Elementos Soportados

### Texto
- **Párrafos** - `<p>` con espaciado
- **Headings** - `<h1>` hasta `<h6>` con tamaños apropiados
- **Texto en negrita** - `<strong>` con clase `font-bold`
- **Texto en cursiva** - `<em>` con clase `italic`
- **Texto subrayado** - `<u>` con clase `underline`
- **Código inline** - `<code>` con estilo monospace

### Listas
- **Listas no ordenadas** - `<ul>` con bullets
- **Listas ordenadas** - `<ol>` con números
- **Elementos de lista** - `<li>` con espaciado

### Otros
- **Citas** - `<blockquote>` con borde lateral azul
- **Separadores** - `<hr>` con espaciado
- **Enlaces** - `<a>` con estilos hover y target=\"_blank\"

### Contenido Incrustado
- **Imágenes** - Renderizadas con Next.js `Image` component
- **Assets** - Enlaces de descarga para archivos no-imagen
- **Entradas** - Renderizadas como cards con información básica

## Personalización

### Estilos CSS

El componente incluye un archivo CSS en `src/styles/RichTextComponent.css`:

```css
.rich-text-content {
  width: 100%;
}

.rich-text-empty {
  color: #6b7280;
  font-style: italic;
}
```

### Clases Tailwind

Puedes usar clases de Tailwind para personalizar el contenedor:

```tsx
<RichTextComponent 
  document={document}
  className="prose prose-xl prose-blue max-w-4xl mx-auto"
/>
```

### Configuración Avanzada

Para personalizar el renderizado de elementos específicos, puedes modificar las opciones en el archivo del componente:

```tsx
const options = {
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node, children) => (
      <p className="my-custom-paragraph-style">{children}</p>
    ),
    // Otros renderizadores personalizados...
  }
};
```

## Testing

El componente incluye pruebas unitarias completas:

```bash
npm test -- RichTextComponent.test.tsx
```

## Ejemplos de Uso

### Con Prosa Styling
```tsx
<RichTextComponent 
  document={content}
  className="prose prose-lg prose-gray max-w-none prose-headings:text-blue-900"
/>
```

### Con Contenedor Personalizado
```tsx
<div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
  <RichTextComponent 
    document={content}
    className="text-gray-800 leading-relaxed"
  />
</div>
```

### En Cards o Componentes
```tsx
function ContentCard({ entry }: { entry: any }) {
  return (
    <div className="border rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">{entry.fields.title}</h2>
      <RichTextComponent 
        document={entry.fields.content}
        className="text-sm text-gray-600"
      />
    </div>
  );
}
```

## Tipos TypeScript

```tsx
import { Document } from '@contentful/rich-text-types';

interface RichTextComponentProps {
  document: Document;
  className?: string;
}
```

## Archivos Creados

- `src/components/molecules/RichTextComponent.tsx` - Componente principal
- `src/types/RichTextTypes.ts` - Definiciones de tipos
- `src/styles/RichTextComponent.css` - Estilos CSS
- `src/components/molecules/ExampleRichTextUsage.tsx` - Ejemplo de uso
- `tests/components/molecules/RichTextComponent.test.tsx` - Pruebas unitarias

## Notas Importantes

1. **Imágenes**: Se renderizan automáticamente con el componente `Image` de Next.js
2. **Enlaces**: Se abren en nueva pestaña por seguridad
3. **Assets**: Los archivos no-imagen se muestran como enlaces de descarga
4. **Error Handling**: Maneja documentos vacíos o inválidos
5. **Performance**: Optimizado para no cargar imágenes como priority por defecto

## Troubleshooting

### Error: "Document is null"
Asegúrate de que el campo de Contentful sea de tipo "Rich text" y que contenga datos válidos.