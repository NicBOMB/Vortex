import { Tag } from 'bbcode-to-react';
import * as React from 'react';

class BrTag extends Tag {
  public override toHTML(): string[] {
    return ['<br />'];
  }

  public override toReact() {
    return <br />;
  }
}

export default BrTag;
