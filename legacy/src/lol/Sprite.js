import styled from "styled-components"
import PropTypes from "prop-types"

export const SpriteImage = styled.div`
  width: ${props => props.image.w}px;
  min-width: ${props => props.image.w}px;
  height: ${props => props.image.h}px;
  min-height: ${props => props.image.h}px;
  background-image: url(${props => `${window.dd.cdn}/${window.dd.version}/img/sprite/${props.image.sprite}`});
  background-position-x: ${props => -props.image.x}px;
  background-position-y: ${props => -props.image.y}px;
  background-repeat: no-repeat;
`

SpriteImage.propTypes = {
  image: PropTypes.shape({
    w: PropTypes.number.isRequired,
    h: PropTypes.number.isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    sprite: PropTypes.string.isRequired
  }).isRequired
}
