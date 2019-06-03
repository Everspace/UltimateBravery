/** @jsx jsx */
import { jsx } from "@emotion/core"
import React from "react"
import { gold } from "style/Colors"

type PanelProps = {
  depth?: number
  children?: any
}

type Panel = React.FC<PanelProps>

export const Panel: Panel = ({ children, depth = 0 }) => {
  return (
    <div
      css={{
        border: `1px solid ${gold}`,
        padding: "1em",
        margin: "1em",
        backgroundColor:
          depth >= 4 ? "#111" : `rgba(11,11,11 0.${20 + depth * 30})`,
        backdropFilter: depth < 4 ? `blur(${8 * depth}px)` : undefined,
      }}
    >
      {React.Children.map(children, child =>
        child.type === Panel
          ? React.cloneElement(child, { depth: depth + 1 })
          : child,
      )}
    </div>
  )
}

export default Panel
