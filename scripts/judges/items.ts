import { itemIn } from "lib/common"
import { arraysIntersect } from "lib/common"

type ItemMapping = Record<cdragon.ItemID, cdragon.Item>
let itemMap: Record<string, cdragon.Item>

const discardReason = (item: cdragon.Item, reason: string) => {
  // console.log(`Discarding ${item.id} ${item.name} - ${reason}`)
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

const isItemEndOfBuild = (itemId: cdragon.ItemID) => {
  const item = getItem(itemId)

  if (!item) {
    console.log(`Discarding ${itemId} - it doesn't exist`)
    return false
  }

  if (item.to.length === 0) {
    return true
  }

  const result = item.to.find(possibleID => {
    if (!item) {
      // Item doesn't exist I guess
      return false
    }
    if (isItemFromAlly(possibleID)) {
      return true
    }
    return false
  })

  return result !== undefined
}

export const itemJudge = (cdragonItems: cdragon.ItemJson) => {
  itemMap = cdragonItems.reduce(
    (memory, item) => {
      memory[item.id] = item
      return memory
    },
    {} as ItemMapping,
  )

  return cdragonItems
    .filter(item => isItemEndOfBuild(item.id))
    .filter(item => {
      if (item.isEnchantment) {
        discardReason(item, `was bad enchantment`)
        return false
      }
      return true
    })
    .filter(item => {
      const { requiredBuffCurrencyName: currency } = item
      const badCurrencies = ["SiegeCurrency"]
      if (itemIn(currency, badCurrencies)) {
        discardReason(item, `currency: ${currency}`)
        return false
      }
      return true
    })
    .filter(item => {
      const badCategories = ["Lane", "Consumable"]
      const badCategory = arraysIntersect(badCategories, item.categories)

      if (badCategory) {
        discardReason(item, `category: ${badCategory}`)
        return false
      }

      return true
    })
    .filter(item => {
      const { requiredChampion } = item
      const badChampions = ["Kalista", "Rengar", "Sylas"]
      if (itemIn(requiredChampion, badChampions)) {
        discardReason(item, `requiredChampion: ${requiredChampion}`)
        return false
      }
      return true
    })
    .filter(item => {
      const { inStore, requiredChampion } = item
      const willDrop = !inStore && requiredChampion === ""
      if (willDrop) {
        discardReason(item, `inStore: ${item.inStore} ${item.requiredChampion}`)
        return false
      }
      return true
    })
}
