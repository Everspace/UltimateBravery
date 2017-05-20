import React from 'react'
import { SpriteImage } from 'lol/Sprite'

export const DebugItem = ({itemID}) => {
  let requiredChampion = window.dat.items.data[itemID].requiredChampion
  let text = `- '${itemID}' ${window.dat.items.data[itemID].name}`
  text = (requiredChampion) ? `${text} (${requiredChampion})` : text

  return (
    <div className='DebugItem' key={itemID}>
      <SpriteImage
        className='Icon'
        {...window.dat.items.data[itemID]}
      />
      <pre>
        <code>{text}</code>
      </pre>
    </div>
  )
}
