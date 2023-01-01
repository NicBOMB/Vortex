import { Tag } from 'bbcode-to-react';

class IdentityTag extends Tag {
  public override toHTML(): string[] {
    return [this.getContent()];
  }

  public override toReact(): React.ReactChild[] {
    return this.getComponents();
  }
}

export default IdentityTag;
