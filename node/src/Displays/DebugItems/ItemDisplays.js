import React from "react"
import { SpriteImage } from "lol/Sprite"
import items, { ItemSprite } from "lol/Items"
import { GlassPanel } from "styles/Panels.jsx"

export const DebugItem = ({itemID}) => {
  let item = items.idToObj(itemID)
  let text = `- '${itemID}' # ${item.name}`
  text = (item.requiredChampion) ? `${text} (${item.requiredChampion})` : text

  return (
    <GlassPanel key={itemID}>
      <ItemSprite {...item} />
      <pre>
        <code>{text}</code>
      </pre>
    </GlassPanel>
  )
}
