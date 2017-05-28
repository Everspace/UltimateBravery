import React from "react"
import { SpriteImage } from "lol/Sprite"
import { idToObj } from "lol/Items"

export const DebugItem = ({itemID}) => {
  let item = idToObj(itemID)
  let text = `- '${itemID}' # ${item.name}`
  text = (item.requiredChampion) ? `${text} (${item.requiredChampion})` : text

  return (
    <div className='DebugItem' key={itemID}>
      <SpriteImage
        className='Icon'
        {...item}
      />
      <pre>
        <code>{text}</code>
      </pre>
    </div>
  )
}
