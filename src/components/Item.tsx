/** @jsx jsx */
import { jsx, css } from "@emotion/core"
import { ItemImage } from "./ItemImage"
import { Panel } from "components/Panel"
import { goldenHighlightBorder } from "style/Borders"

type ItemProps = UltimateBravery.BraveryItem
type Item = React.FC<ItemProps>

const style = css({
  display: "inline-flex",
  margin: "0.5em",
  alignItems: "center",
  "& > img": [
    goldenHighlightBorder,
    {
      borderRadius: "10px", // gets rid of white on bloodthurster and such
      marginRight: "1em",
    },
  ],
})

const enchantmentStyle = css({
  backgroundColor: "#CCC",
})

const Item: Item = ({ id, name, children, isEnchantment, ...props }) => {
  return (
    <Panel css={[style, isEnchantment && enchantmentStyle]}>
      <ItemImage id={id} />
      {id} - {name}
    </Panel>
  )
}

export default Item
