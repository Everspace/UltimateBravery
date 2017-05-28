import React, { PropTypes } from "react"

let spriteStyleFromImage = (image) => {
  return {
    width: image.w,
    minWidth: image.w,
    height: image.h,
    minHeight: image.h,
    // Currently not using backgroundPositionX or Y because it sometimes
    // doesn't set the style attribute on the div correctly
    // background: `${} ${}px ${}px`,
    backgroundImage: `url('${window.dd.cdn}/${window.dd.version}/img/sprite/${image.sprite}')`,
    backgroundPositionX: -image.x,
    backgroundPositionY: -image.y,
    backgroundRepeat: "no-repeat"
  }
}

export const SpriteImage = ({image, onClick, className, name, style}) =>
  <div
    className={className}
    onClick={onClick}
    name={name}
    style={Object.assign({}, spriteStyleFromImage(image), style)}
  />

SpriteImage.propTypes = {
  image: PropTypes.object.isRequired,
  className: PropTypes.string,
  onClick: PropTypes.func,
  name: PropTypes.string,
  style: PropTypes.object
}
