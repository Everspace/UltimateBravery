import * as types from "./types"
import * as Random from "common/Random"
import items from "lol/Items"
import * as championActions from "./championActions"

export const newBravery = (mapID, availableChampions) => {
  let champion = Random.roll(availableChampions)

  let summonerSpells = Random.shuffle([
    "Exhaust",
    "Ignite",
    "Smite",
    "Heal",
    "Barrier",
    "Snowball",
    "Teleport",
    "Flash"
  ]).slice(0, 2)

  let itemsList = items.filterForChampion(
    Random.shuffle(items.allInMap(mapID)),
    champion,
    summonerSpells.indexOf("Smite") > -1
  )

  let plainAction = {
    type: types.NEW_BRAVERY,
    mapID: mapID,
    championID: champion,
    itemList: itemsList,
    boot: Random.roll(items.allInGroup("boot")),
    summonerSpells: summonerSpells
  }

  if (championActions[champion]) {
    return championActions[champion](plainAction)
  } else {
    return plainAction
  }
}
