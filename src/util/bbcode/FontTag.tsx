import { Tag } from 'bbcode-to-react';
import * as React from 'react';

class FontTag extends Tag {
  public override toHTML(): string[] {
    const font = this.params.font;

    return [`<span style="font-family:${font}">`, this.getContent(), '</span>'];
  }

  public override toReact() {
    const font = this.params.font;

    return (
      <span style={{ fontFamily: font }}>{this.getComponents()}</span>
    );
  }
}

export default FontTag;
