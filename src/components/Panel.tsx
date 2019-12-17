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
}) =>
  jsx(
    type,
    {
      css: [
        goldenHighlightBorder,
        {
          padding: "1em",
          margin: "1em",
          backgroundColor:
            depth > 3
              ? "rgb(11,11,11)"
              : `rgba(11,11,11, 0.${30 + (depth + 1) * 15})`,
          backdropFilter:
            depth < 4 ? `blur(${6 * (depth + 1) + 6}px)` : undefined,
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

export default Panel
