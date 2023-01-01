import * as React from 'react';

export interface IDashletProps {
  className: string;
  title: string;
}

class Dashlet extends React.Component<IDashletProps, {}> {
  public override render() {
    const { className, title } = this.props;
    const classes = ['dashlet'].concat(className.split(' '));
    return (
      <div className={classes.join(' ')}>
        {!!title ? <div className='dashlet-title'>{title}</div> : null}
        {this.props.children}
      </div>
    );
  }
}

export default Dashlet;
