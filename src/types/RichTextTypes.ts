import { Document } from '@contentful/rich-text-types';

export interface RichTextComponentProps {
  /**
   * The rich text document from Contentful
   */
  document: Document;
  /**
   * Optional CSS classes for styling the container
   */
  className?: string;
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
