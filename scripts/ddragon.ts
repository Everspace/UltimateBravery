import { downloadLatestDDragon, getDDragonVersion } from "./lib/ddragon"
import { untar, wget, saveJson } from "./lib/common"
import { itemJudge } from "./judges/items"

// http://ddragonexplorer.com/cdn/
//

const reportFail = (err: any) => {
  console.error(err)
  process.exit(1)
}

const outputDir = "../public/data"
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

  console.log("Beginning judgement")
  const itemsGood = itemJudge(communityDragonItems)
  console.log("Finished judgement")
  const mapIds = new Set<string>()
  const modeIds = new Set<string>()

  const itemMappings = itemsGood.reduce((memory, item) => {
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
  }, {} as Record<string, number[]>)

  const mapInfo: Record<string, string[]> = {}
  mapInfo.mapIds = Array.from(mapIds.keys())
  mapInfo.modeIds = Array.from(modeIds.keys())

  const itemIds = itemsGood.reduce((memory, item) => {
    memory[item.id.toString()] = item
    return memory
  }, {} as Record<string, cdragon.Item>)
  saveJson(mapInfo, `${outputDir}/mapInfo.json`, true)
  saveJson(itemIds, `${outputDir}/items.json`, true)
  saveJson(itemMappings, `${outputDir}/item-mappings.json`, true)
}

main()
