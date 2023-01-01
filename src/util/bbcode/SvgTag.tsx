import Icon from '../../controls/Icon';

import { Tag } from 'bbcode-to-react';
import * as React from 'react';

class SvgTag extends Tag {
  public override toHTML(): string[] {
    return [`<svg
      preserveAspectRatio='xMidYMid meet'
      class='icon icon-${this.getContent()}'
    >
    <use xlink:href=#'${this.getContent()}'>
    </svg>`];
  }

  public override toReact() {
    return (
      <Icon name={this.getContent()} />
    );
  }
}

export default SvgTag;
