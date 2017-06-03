import React from "react"
import PropTypes from "prop-types"
import styled, { css } from "styled-components"

const Panel = ({depth, children, ...otherProps}) => {
  return <div {...otherProps}>
    {
      React.Children.map(
        children,
        child => child.type === Panel ?
                    React.cloneElement(child, {depth: depth + 1})
                  : child
      )
    }
  </div>
}

Panel.propTypes = {
  depth: PropTypes.number,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element)
  ])
}

Panel.defaultProps = {
  depth: 1
}

export const GlassPanel = styled(Panel)`
  border: 1px solid hsl(40, 50%, 30%);
  padding: 1em;
  margin 1em;
  background-color: ${props =>
    (props.depth >= 4) ?
      "#111"
    : `rgba(11,11,11, 0.${20 + props.depth * 30})`
  };
  ${props => {
    if (props.depth < 4) {
      return css`
        -webkit-backdrop-filter: blur(${8 * props.depth}px);
                backdrop-filter: blur(${8 * props.depth}px);
      `
    } else {
      return ""
    }
  }}
`

GlassPanel.defaultProps = Panel.defaultProps
GlassPanel.propTypes = Panel.propTypes
