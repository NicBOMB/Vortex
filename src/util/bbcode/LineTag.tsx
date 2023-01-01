import { Tag } from 'bbcode-to-react';
import * as React from 'react';

class LineTag extends Tag {
  public override toHTML(): string[] {
    return ['<hr />', this.getContent()];
  }

  public override toReact() {
    return (
      <div>
        <hr />
        {this.getComponents()}
      </div>
    );
  }
}

export default LineTag;
