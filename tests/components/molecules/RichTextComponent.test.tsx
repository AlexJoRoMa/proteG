import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import RichTextComponent from '@/components/molecules/RichTextComponent';
import { Document, BLOCKS, MARKS } from '@contentful/rich-text-types';

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: { src: string; alt: string; [key: string]: unknown }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />
  ),
}));

describe('RichTextComponent', () => {
  const mockDocument: Document = {
    nodeType: BLOCKS.DOCUMENT,
    data: {},
    content: [
      {
        nodeType: BLOCKS.HEADING_1,
        data: {},
        content: [
          {
            nodeType: 'text',
            value: 'Test Heading',
            marks: [],
            data: {}
          }
        ]
      },
      {
        nodeType: BLOCKS.PARAGRAPH,
        data: {},
        content: [
          {
            nodeType: 'text',
            value: 'This is a test paragraph with ',
            marks: [],
            data: {}
          },
          {
            nodeType: 'text',
            value: 'bold text',
            marks: [{ type: MARKS.BOLD }],
            data: {}
          }
        ]
      }
    ]
  };

  const emptyDocument: Document = {
    nodeType: BLOCKS.DOCUMENT,
    data: {},
    content: []
  };

  it('renders rich text content correctly', () => {
    render(<RichTextComponent document={mockDocument} />);
    
    expect(screen.getByText('Test Heading')).toBeInTheDocument();
    expect(screen.getByText('bold text')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Test Heading');
  });

  it('applies custom className', () => {
    const { container } = render(
      <RichTextComponent document={mockDocument} className="custom-class" />
    );
    
    const richTextElement = container.querySelector('.rich-text-content');
    expect(richTextElement).toHaveClass('custom-class');
  });

  it('handles empty document gracefully', () => {
    render(<RichTextComponent document={emptyDocument} />);
    
    expect(screen.getByText('No content available')).toBeInTheDocument();
  });

  it('handles null/undefined document', () => {
    render(<RichTextComponent document={null as unknown as Document} />);
    
    expect(screen.getByText('No content available')).toBeInTheDocument();
  });

  it('renders bold text with correct styling', () => {
    render(<RichTextComponent document={mockDocument} />);
    
    const boldElement = screen.getByText('bold text');
    expect(boldElement.tagName).toBe('STRONG');
    expect(boldElement).toHaveClass('font-bold');
  });

  it('renders headings with correct hierarchy', () => {
    const headingDocument: Document = {
      nodeType: BLOCKS.DOCUMENT,
      data: {},
      content: [
        {
          nodeType: BLOCKS.HEADING_1,
          data: {},
          content: [{ nodeType: 'text', value: 'H1', marks: [], data: {} }]
        },
        {
          nodeType: BLOCKS.HEADING_2,
          data: {},
          content: [{ nodeType: 'text', value: 'H2', marks: [], data: {} }]
        }
      ]
    };

    render(<RichTextComponent document={headingDocument} />);
    
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('H1');
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('H2');
  });
});
