import { SeoFields, SEOHeadProps} from "@/types/SEOTypes";

export default function SEOHead({ seo, slug}: SEOHeadProps) {
    
    const bastURL =  seo.baseUrl;
    const canonicalURL = `${bastURL}/${slug}`;
  
    const imagen = (seo?.imagen as SeoFields["imagen"])
    const imgURL = imagen.fields.image.fields.file.url;

    
    
    return (
        <>
        <link rel="canonical" href={canonicalURL}/>
        <title>{seo?.titulo || "izzi"}</title>
        <meta name="description" content={seo?.descripcion || "izzi desc"} />
        <meta name="robots" content={seo?.noIndex ? 'index, follow' : 'noIndex, no follow'} />
        
        
        {/* OpenGraph */}
        <meta property="og:title" content={seo?.tituloCorto || 'izzi'}/>
        <meta property="og:description" content={seo?.descripcionCorto || 'izzi descripcion'}/>
        <meta property="og:type" content="website"/>
        <meta property="og:url" content={canonicalURL} />
        {imgURL && <meta property="og:image" content={imgURL}/>}
        
        
        {/* Twitter summary summary_large_image */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seo?.tituloCorto || 'izzi'}/>
        <meta name="twitter:description" content={seo?.descripcionCorto || 'izzi descripcion'}/>
        {imgURL && <meta name="twitter:image" content={imgURL}/>}
        
        </>
    );
}