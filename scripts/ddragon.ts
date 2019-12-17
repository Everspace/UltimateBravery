import { downloadLatestDDragon, getDDragonVersion } from "./lib/ddragon"
import { untar, wget, saveJson, arraysIntersect, itemIn } from "./lib/common"
import { number } from "prop-types"

// http://ddragonexplorer.com/cdn/
//
type ItemMapping = Record<cdragon.ItemID, cdragon.Item>
let itemMap: Record<string, cdragon.Item>

const discardReason = (item: cdragon.Item, reason: string) => {
  // console.log(`Discarding ${item.id} ${item.name} - ${reason}`)
}

const getItem = (itemId: cdragon.ItemID) => {
  return itemMap[itemId.toString()]
}

const isItemFromTransforming = (itemId: cdragon.ItemID) => {
  const item = getItem(itemId)
  if (!item) {
    return false
  }
  return true
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

  if (item.to.length == 0) {
    return true
  }

  const result = item.to.find(possibleID => {
    if (!item) {
      // Item doesn't exist I guess
      return false
    }
    // if (isItemFromTransforming(possibleID)) {
    //   return true
    // }
    if (isItemFromAlly(possibleID)) {
      return true
    }
    return false
  })

  return result !== undefined
}

const judge = (cdragonItems: cdragon.ItemJson) => {
  let goodItems: cdragon.Item[] = []
  const badItems: number[] = []
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

const reportFail = (err: any) => {
  console.error(err)
  process.exit(1)
}

const outputDir = "./public/data"
const communityDragonItemsUrl =
  "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/items.json"
const main = async () => {
  const version = await getDDragonVersion()
  saveJson(version, `${outputDir}/ddragon-version.json`)

  const tarFile: string = await downloadLatestDDragon()
  console.log(`DDragon available at ${tarFile}`)
  const untaredPath = await untar(tarFile)
  console.log(`Extracted at ${untaredPath}`)
  const communityDragonItems: cdragon.ItemJson = await wget(
    communityDragonItemsUrl,
  )
    .then(JSON.parse)
    .catch(reportFail)

  saveJson(communityDragonItems, `${outputDir}/cdragon-items.json`, true)

  itemMap = communityDragonItems.reduce(
    (memory, item) => {
      memory[item.id] = item
      return memory
    },
    {} as ItemMapping,
  )

  console.log("Beginning judgement")
  const itemsGood = judge(communityDragonItems)
  console.log("Finished judgement")
  const mapIds = new Set<string>()
  const modeIds = new Set<string>()

  const itemMappings = itemsGood.reduce(
    (memory, item) => {
      item.mapStringIdInclusions.forEach(map => {
        mapIds.add(map)
        const arr = memory[map] || []
        arr.push(item.id)
        memory[map] = arr
      })
      item.modeNameInclusions.forEach(mode => {
        modeIds.add(mode)
        const arr = memory[mode] || []
        arr.push(item.id)
        memory[mode] = arr
      })
      return memory
    },
    {} as Record<string, number[]>,
  )

  const mapInfo: Record<string, string[]> = {}
  mapInfo.mapIds = Array.from(mapIds.keys())
  mapInfo.modeIds = Array.from(modeIds.keys())

  const itemIds = itemsGood.reduce(
    (memory, item) => {
      memory[item.id.toString()] = item
      return memory
    },
    {} as Record<string, cdragon.Item>,
  )
  saveJson(mapInfo, `${outputDir}/mapInfo.json`, true)
  saveJson(itemIds, `${outputDir}/items.json`, true)
  saveJson(itemMappings, `${outputDir}/item-mappings.json`, true)
}

main()
