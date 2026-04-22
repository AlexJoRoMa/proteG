import React from 'react';
import { Document } from '@contentful/rich-text-types';
import { ColorOption } from '@/constants/ColorModalConstants';

export interface RichTextComponentProps {
  /**
   * The rich text document from Contentful
   */
  document: Document;
  /**
   * Optional CSS classes for styling the container
   */
  className?: string;
  /**
   * Optional color option for HR elements
   */
  hrColor?: ColorOption;
  /**
   * Optional inline styles for the container (e.g. text color from Contentful)
   */
  style?: React.CSSProperties;
  /**
   * Optional hover text applied as title on images
   */
  hoverText?: string;
}

export interface RichTextRendererOptions {
  /**
   * Custom render options for specific node types
   */
  preserveWhitespace?: boolean;
  /**
   * Custom rendering for embedded entries
   */
  renderEmbeddedEntry?: boolean;
}

export interface ContentfulAssetNode {
  data: {
    target: {
      fields: {
        file?: {
          url: string;
          contentType?: string;
          details?: {
            image?: {
              width: number;
              height: number;
            };
          };
        };
        title?: string;
        description?: string;
      };
    };
  };
}

export interface ContentfulEntryNode {
  data: {
    target: {
      fields: {
        title?: string;
        [key: string]: unknown;
      };
      sys: {
        contentType: {
          sys: {
            id: string;
          };
        };
      };
    };
  };
}

export interface ContentfulHyperlinkNode {
  data: {
    uri: string;
  };
}
