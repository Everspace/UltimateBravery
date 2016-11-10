import React, { PropTypes } from 'react';

class SpriteImage extends React.Component {

  render() {
    let url = `url('${this.props.dd.cdn}/${this.props.dd.version}/img/sprite/${this.props.image.sprite}')`

    let style = {
      width: this.props.image.w,
      minWidth: this.props.image.w,
      height: this.props.image.h,
      minHeight: this.props.image.h,
      //Currently not using backgroundPositionX or Y because it sometimes
      //doesn't set the style attribute on the div correctly
      background: `${url} ${-this.props.image.x}px ${-this.props.image.y}px`,
      backgroundRepeat: "no-repeat"
    }

    return <div
      className={this.props.className}
      onClick={this.props.onClick}
      name={this.props.name}
      style={Object.assign({},style,this.props.style)}
    />;
  }
}

SpriteImage.propTypes = {
  image: PropTypes.object.isRequired
}

export default SpriteImage;