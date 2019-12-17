import React from "react"
import items, { ItemSprite } from "lol/Items"
import { GlassPanel } from "common/components/Panels"

const DebugItemPanel = GlassPanel.extend`
  border: 1px solid ${props => props.theme.colorBorderIntrestBase};
  background-color: rgba(20,20,20, 0.75);

  flex: auto;
  width: 45%;
  margin: 0.5em;
  padding: 0.5em;

  & > * {
    display: inline-block;
    vertical-align: middle;
  }

  pre {
    border: 1px solid ${props => props.theme.colorBorderIntrestBase};
    background-color: ${props => props.theme.colorBase};
    padding: 0.5em;
    margin: 0.2em;
    max-width: 87%;
    overflow-x: auto;
  }
`

export const DebugItem = ({itemID}) => {
  let item = items.idToObj(itemID)
  let text = `- '${itemID}' # ${item.name}`
  text = (item.requiredChampion) ? `${text} (${item.requiredChampion})` : text

  return (
    <DebugItemPanel key={itemID}>
      <ItemSprite key={itemID} {...item} />
      <pre key='code'>
        <code>{text}</code>
      </pre>
    </DebugItemPanel>
  )
}
