/** @jsx jsx */
import { jsx } from "@emotion/core"
import React from "react"
import { goldenHighlightBorder } from "style/Borders"

type PanelProps = {
  depth?: number
  children?: any
  className?: string
  type?: keyof JSX.IntrinsicElements
}

type Panel = React.FC<PanelProps>

export const Panel: Panel = ({
  children,
  type = "div",
  className,
  depth = 0,
}) => {
  return jsx(
    type,
    {
      css: [
        goldenHighlightBorder,
        {
          padding: "1em",
          margin: "1em",
          backgroundColor:
            depth >= 4
              ? "rgb(11,11,11)"
              : `rgba(11,11,11, 0.${40 + depth * 20})`,
          backdropFilter: depth < 4 ? `blur(${8 * depth + 4}px)` : undefined,
        },
      ],
      className: className,
    },
    React.Children.map(children, child =>
      child.type === Panel
        ? React.cloneElement(child, { depth: depth + 1 })
        : child,
    ),
  )
}

export default Panel
