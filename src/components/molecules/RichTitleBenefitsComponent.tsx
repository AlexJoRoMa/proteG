import { BLOCKS } from '@contentful/rich-text-types';
import { Options } from '@contentful/rich-text-react-renderer'

export const richTextOptions: Options = {
  renderNode: {
    [BLOCKS.HEADING_1]: (node, children) => (
      <h1 className="text-3xl text-center mb-4">{children}</h1>
    )
  }
};
