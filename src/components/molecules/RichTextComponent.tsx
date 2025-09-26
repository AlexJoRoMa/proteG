"use client";

import React from 'react';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, MARKS, INLINES, Block, Inline } from '@contentful/rich-text-types';
import {
  RichTextComponentProps,
  ContentfulAssetNode,
  ContentfulEntryNode,
  ContentfulHyperlinkNode
} from '@/types/RichTextTypes';
import Image from 'next/image';
import '@/styles/RichTextComponent.css';
import Link from 'next/link';
import { componentMap } from '@/lib/modal/dynamic-map';

/**
 * RichTextComponent - Renders Contentful rich text content
 * 
 * This component takes a Contentful rich text document and renders it as React components
 * with custom styling and support for embedded assets and entries.
 */
const RichTextComponent: React.FC<RichTextComponentProps> = ({ 
  document, 
  className = '',
  hrColor
}) => {
  // Custom rendering options for different node types
  const options = {
    renderMark: {
      [MARKS.BOLD]: (text: React.ReactNode) => (
        <strong className="font-bold">{text}</strong>
      ),
      [MARKS.ITALIC]: (text: React.ReactNode) => (
        <em className="italic">{text}</em>
      ),
      [MARKS.UNDERLINE]: (text: React.ReactNode) => (
        <u className="underline">{text}</u>
      ),
      [MARKS.CODE]: (text: React.ReactNode) => (
        <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">{text}</code>
      ),
    },
    renderNode: {
      [BLOCKS.PARAGRAPH]: (node: Block | Inline, children: React.ReactNode) => {
        // Función para aplanar fragments y obtener elementos reales
        const getAllChildren = (children: React.ReactNode): React.ReactNode[] => {
          const result: React.ReactNode[] = [];
          
          React.Children.forEach(children, (child) => {
            if (React.isValidElement(child)) {
              if (child.type === React.Fragment) {

                const fragmentProps = child.props as { children?: React.ReactNode };
                result.push(...getAllChildren(fragmentProps.children));
              } else {
                result.push(child);
              }
            } else if (child !== null && child !== undefined && child !== '') {

              result.push(child);
            }
          });
          
          return result;
        };

        const allChildren = getAllChildren(children);
        
        // Verificar si TODOS los elementos válidos son embedded-entry-inline
        const nonEmptyChildren = allChildren.filter(child => {

          if (typeof child === 'string') {
            return child.trim() !== '';
          }
          return child !== null && child !== undefined;
        });


        const embeddedInlineElements: React.ReactNode[] = [];
        const otherElements: React.ReactNode[] = [];
        let hasVerticalOrientation = false;

        nonEmptyChildren.forEach(child => {
          if (React.isValidElement(child)) {
            const childProps = child.props as { className?: string; 'data-orientation'?: string };
            const className = childProps?.className;
            if (typeof className === 'string' && className.includes('embedded-entry-inline')) {
              embeddedInlineElements.push(child);
              
              // Verificar si tiene orientación vertical (verifica tanto en props como en data-orientation)
              if (childProps?.['data-orientation'] === 'vertical') {
                hasVerticalOrientation = true;
              }
              
              try {
                const componentProps = child.props as { children?: { props?: { orientation?: string } } };
                if (componentProps?.children?.props?.orientation === 'vertical') {
                  hasVerticalOrientation = true;
                }
              } catch {

              }
            } else {
              otherElements.push(child);
            }
          } else {
            otherElements.push(child);
          }
        });

        const isAllEmbeddedInline = nonEmptyChildren.length > 0 && embeddedInlineElements.length === nonEmptyChildren.length;
        const hasManyEmbeddedInline = embeddedInlineElements.length >= 2;
        const hasMixedContent = otherElements.length > 0 && embeddedInlineElements.length > 0;

        // Generar clase CSS con orientación vertical si es necesario
        const embeddedGroupClass = hasVerticalOrientation 
          ? "embedded-inline-group embedded-inline-vertical" 
          : "embedded-inline-group";

        // Si todos son embedded-entry-inline, usar embedded-inline-group
        if (isAllEmbeddedInline) {
          return <div className={embeddedGroupClass}>{children}</div>;
        }

        // Si hay contenido mixto con múltiples embedded-entry-inline, separar
        if (hasMixedContent && hasManyEmbeddedInline) {
          return (
            <div className='contents'>
              {otherElements.length > 0 && (
                <p className="text-base w-full">{otherElements}</p>
              )}
              <div className={embeddedGroupClass}>{embeddedInlineElements}</div>
            </div>
          );
        }

        return <p className="text-base w-full">{children}</p>;
      },
      [BLOCKS.HEADING_1]: (_node: Block | Inline, children: React.ReactNode) => (
        <h1 className="text-4xl ">{children}</h1>
      ),
      [BLOCKS.HEADING_2]: (_node: Block | Inline, children: React.ReactNode) => (
        <h2 className="xl:text-[32px] text-[24px] leading-10">{children}</h2>
      ),
      [BLOCKS.HEADING_3]: (_node: Block | Inline, children: React.ReactNode) => (
        <h3 className="text-2xl ">{children}</h3>
      ),
      [BLOCKS.HEADING_4]: (_node: Block | Inline, children: React.ReactNode) => (
        <h4 className="text-xl ">{children}</h4>
      ),
      [BLOCKS.HEADING_5]: (_node: Block | Inline, children: React.ReactNode) => (
        <h5 className="text-lg ">{children}</h5>
      ),
      [BLOCKS.HEADING_6]: (_node: Block | Inline, children: React.ReactNode) => (
        <h6 className="text-base ">{children}</h6>
      ),
      [BLOCKS.UL_LIST]: (_node: Block | Inline, children: React.ReactNode) => (
        <ul className="list-disc pl-6">{children}</ul>
      ),
      [BLOCKS.OL_LIST]: (_node: Block | Inline, children: React.ReactNode) => (
        <ol className="list-decimal pl-6">{children}</ol>
      ),
      [BLOCKS.LIST_ITEM]: (_node: Block | Inline, children: React.ReactNode) => (
        <li className="text-base leading-relaxed">{children}</li>
      ),
      [BLOCKS.QUOTE]: (_node: Block | Inline, children: React.ReactNode) => (
        <blockquote className="border-l-4 pl-4 py-2 italic bg-gray-50 rounded-r">
          {children}
        </blockquote>
      ),
      [BLOCKS.HR]: () => {
        const hrClasses = hrColor 
          ? `border-none h-0.5 rich-text-hr-${hrColor.toLowerCase()}`
          : "border-t border-gray-300";
        
        return (
          <hr className={hrClasses} />
        );
      },
      [INLINES.HYPERLINK]: (node: Block | Inline, children: React.ReactNode) => {
        const linkNode = node as unknown as ContentfulHyperlinkNode;
        return (
          <Link
            href={linkNode.data.uri}
            className="text-black hover:text-gray-200 hover:font-normal font-bold underline transition-colors duration-200"
            target="_blank"
            rel="noopener noreferrer"
          >
            {children}
          </Link>
        );
      },
      [BLOCKS.EMBEDDED_ASSET]: (node: Block | Inline) => {
        const assetNode = node as unknown as ContentfulAssetNode;
        const { file, title, description } = assetNode.data.target?.fields || {};
        const imageUrl = file?.url ? `https:${file.url}` : '';
        const alt = description || title || 'Embedded asset';

        if (file?.contentType?.startsWith('image/')) {
          return (
            <Image
              src={imageUrl}
              alt={alt}
              width={file.details?.image?.width || 800}
              height={file.details?.image?.height || 600}
              className="max-w-full h-auto inline"
              priority={false}
            />
          );
        }

        // For non-image assets, show a download link
        return (
          <div className="border border-gray-300 rounded-lg bg-gray-50">
            <a
              href={imageUrl}
              className="text-blue-600 hover:text-blue-800 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              📎 {title || 'Download file'}
            </a>
            {description && (
              <p className="text-sm text-gray-600 mt-1">{description}</p>
            )}
          </div>
        );
      },
      [BLOCKS.EMBEDDED_ENTRY]: (node: Block | Inline) => {

        const entryNode = node as unknown as ContentfulEntryNode;
        const entry = entryNode.data.target;
        const contentType = entry?.sys.contentType.sys.id;
        const Component = typeof entry?.fields?.type === 'string' && entry?.fields?.type in componentMap ? componentMap[entry?.fields?.type as keyof typeof componentMap] : null as unknown as React.ComponentType<unknown>;

        if (Component) {

            return (
              <Component
                {...entry.fields}
              />
            );
    
        }


        return (
          <div className="bg-gray-100 p-4 rounded">
            <p>Embedded resource of type {contentType} is not supported.</p>
          </div>
        );
      },

      ["embedded-entry-inline"]: (node: Block | Inline) => {

        const resourceNode = node as unknown as ContentfulEntryNode;
        const entry = resourceNode.data.target;
        const contentType = entry?.sys.contentType.sys.id;
        const Component = typeof entry?.fields?.type === 'string' && entry?.fields?.type in componentMap ? componentMap[entry?.fields?.type as keyof typeof componentMap] : null as unknown as React.ComponentType<unknown>;

            // Agregar atributo data para orientación si existe
            const orientation = entry?.fields?.orientation;
            const dataAttributes = orientation ? { 'data-orientation': orientation } : {};

        if (Component) {

              return(  
                <div className='embedded-entry-inline' {...dataAttributes}>
                    <Component {...entry.fields}
                    data-embedded-entry-inline />
                </div>
              )

        }


            return (
            <div className="bg-gray-100 p-4 rounded embedded-entry-inline">
                <p>Embedded resource of type {contentType} is not supported.</p>
            </div>
            );
        }
    },
  };


  if (!document || !document.content || document.content.length === 0) {
    return (
      <div className={`rich-text-empty ${className}`}>
        No content available
      </div>
    );
  }

  return (
    <div className={`rich-text-content ${className}`}>
      {documentToReactComponents(document, options)}
    </div>
  );
};

export default RichTextComponent;
