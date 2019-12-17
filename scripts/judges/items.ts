import { itemIn } from "lib/common"
import { arraysIntersect } from "lib/common"
import { filter, curry, overEvery } from "lodash"

type ItemMapping = Record<cdragon.ItemID, cdragon.Item>
let itemMap: Record<string, cdragon.Item>

const discardReason = (item: cdragon.Item, reason: string) => {
  console.log(`Discarding ${item.id} ${item.name} - ${reason}`)
}

const getItem = (itemId: cdragon.ItemID) => {
  return itemMap[itemId.toString()]
}

const isItemFromAlly = (itemId: cdragon.ItemID) => {
  const item = getItem(itemId)
  if (!item) {
    return false
  }
  try {
    return item.requiredAlly !== ""
  } catch (err) {
    console.log(`${itemId} - ${item.name} didn't have requiredAlly`)
    throw err
  }
}

const itemEndOfBuildFilter = (item: cdragon.Item) => {
  if (item.to.length === 0) {
    return true
  }

  // Check to see if to item is from Orrn
  const result = item.to.find(possibleID => {
    // If it is from Ornn, we want that id
    if (isItemFromAlly(possibleID)) {
      return true
    }
    return false
  })

  // If we didn't get an id, then all the to's were actual items
  // rather than orrn provided ones,
  // and the item fails
  if (result === undefined) {
    discardReason(item, `built into something ${result}`)
    return false
  }

  return true
}

type ItemJudgeFilter = (item: cdragon.Item) => boolean

const enchantmentFilter: ItemJudgeFilter = item => {
  if (item.isEnchantment) {
    discardReason(item, `was bad enchantment`)
    return false
  }
  return true
}

const specialCurrencyFilter: ItemJudgeFilter = item => {
  const { requiredBuffCurrencyName: currency } = item
  const badCurrencies = ["SiegeCurrency"]
  if (itemIn(currency, badCurrencies)) {
    discardReason(item, `currency: ${currency}`)
    return false
  }
  return true
}

const categoryFilter: ItemJudgeFilter = item => {
  const badCategories = ["Lane", "Consumable"]
  const badCategory = arraysIntersect(badCategories, item.categories)

  if (badCategory) {
    discardReason(item, `category: ${badCategory}`)
    return false
  }

  return true
}

const championUniqueFilter: ItemJudgeFilter = item => {
  const { requiredChampion } = item
  const badChampions = ["Kalista", "Rengar", "Sylas"]
  if (itemIn(requiredChampion, badChampions)) {
    discardReason(item, `requiredChampion: ${requiredChampion}`)
    return false
  }
  return true
}

const inStoreFilter: ItemJudgeFilter = item => {
  const { inStore, requiredChampion } = item
  const willDrop = !inStore && requiredChampion === ""
  if (willDrop) {
    discardReason(item, `inStore: ${item.inStore} ${item.requiredChampion}`)
    return false
  }
  return true
}

const allFilters = overEvery(
  ...[
    itemEndOfBuildFilter,
    inStoreFilter,
    categoryFilter,
    enchantmentFilter,
    specialCurrencyFilter,
    championUniqueFilter,
  ].map(curry),
)

export const itemJudge = (cdragonItems: cdragon.Item[]) => {
  itemMap = cdragonItems.reduce((memory, item) => {
    memory[item.id] = item
    return memory
  }, {} as ItemMapping)

  return filter(cdragonItems, allFilters)
}
