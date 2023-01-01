import { Tag } from 'bbcode-to-react';
import * as React from 'react';

class HeadingTag extends Tag {
  public override toHTML(): string[] {
    return [`<h3>`, this.getContent(), '</h3>'];
  }

  public override toReact() {
    return (
      <h3>{this.getComponents()}</h3>
    );
  }
}

export default HeadingTag;
