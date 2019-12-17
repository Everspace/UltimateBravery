/** @jsx jsx */
import { jsx, css } from "@emotion/core"
import { useFetchJson } from "lib/hooks"
import Item from "components/Item"
import { createContext, useContext } from "react"

type ItemGridProps = { items: number[] }

type ItemGrid = React.FC<ItemGridProps>

const ItemContext = createContext<Record<string, cdragon.Item>>({})

const gridStyle = css({
  display: "grid",
  gridTemplateColumns: "1fr",
  "@media (min-width: 650px)": {
    gridTemplateColumns: "1fr 1fr",
  },
})

const ItemGrid: ItemGrid = ({ items, ...props }) => {
  const mapping = useContext(ItemContext)
  const mappedItems = items.map(item => mapping[item.toString()])
  return (
    <div css={gridStyle}>
      {mappedItems.map(item => (
        <Item key={item.id} {...item} />
      ))}
    </div>
  )
}

export const DebugItemGrid: React.FC<{ map?: string; mode?: string }> = ({
  map = "SR",
  mode = "URF",
}) => {
  const maps = useFetchJson<Record<string, number[]>>(
    "/data/item-mappings.json",
  )
  const items = useFetchJson<Record<string, cdragon.Item>>("/data/items.json")

  if (maps.payload && items.payload) {
    const selectedMap = maps.payload[map]
    const selectedMode = maps.payload[mode]

    const allItems = selectedMap.filter(item => selectedMode.indexOf(item) > -1)

    return (
      <ItemContext.Provider value={items.payload}>
        <ItemGrid items={allItems} />
      </ItemContext.Provider>
    )
  } else {
    return <div>Loading...</div>
  }
}

export default DebugItemGrid
