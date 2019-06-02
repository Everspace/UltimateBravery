import React, { useContext } from "react"
import { DDragonContext, DDragonCDN } from "./DDragon"

type ItemImageProps = { id: number }

type ItemImage = React.FC<ItemImageProps>

export const ItemImage: ItemImage = ({ id }) => {
  const { version } = useContext(DDragonContext)

  return (
    <img key={id} alt="" src={`${DDragonCDN}/${version}/img/item/${id}.png`} />
  )
}

export default ItemImage
