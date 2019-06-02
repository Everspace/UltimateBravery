/** @jsx jsx */
import { jsx, css } from "@emotion/core"
import { ItemImage } from "./ItemImage"

type ItemProps = UltimateBravery.BraveryItem
type Item = React.FC<ItemProps>

const style = css({
  display: "inline-flex",
  margin: "0.5em",
  alignItems: "center",
  "& > img": {
    marginRight: "0.5em",
  },
})

const enchantmentStyle = css({
  backgroundColor: "#CCC",
})

const Item: Item = ({ id, name, children, isEnchantment, ...props }) => {
  return (
    <span css={[style, isEnchantment && enchantmentStyle]}>
      <ItemImage id={id} />
      {id} - {name}
    </span>
  )
}

export default Item
