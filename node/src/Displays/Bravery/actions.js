import * as types from "./types"
import { shuffle } from "common/Random"
import * as items from "lol/Items"

let tossItems = function (itemList, championID, couldJungle) {
  let champion = window.dat.champions.data[championID]

  // Remove everything that actually influences the bravery based on
  // attributes we know
  itemList = !champion.isMelee ? itemList : items.dropAllInGroup(itemList, "melee")
  itemList = !champion.isRanged ? itemList : items.dropAllInGroup(itemList, "range")
  itemList = couldJungle ? itemList : items.dropAllInGroup(itemList, "jungle")

  // Remove Boots because we grab those from elsewhere
  itemList = items.dropAllInGroup(itemList, "boot")

  // Remove champion unique because nobody will willingly
  // want things baught with silver serpents.
  itemList = items.dropAllInGroup(itemList, "championUnique")

  return itemList
}

export const newBravery = (mapID, availableChampions) => {
  let champion = shuffle(availableChampions)[0]

  let summonerSpells = shuffle([
    "Exhaust",
    "Ignite",
    "Smite",
    "Heal",
    "Barrier",
    "Snowball",
    "Teleport",
    "Flash"
  ]).slice(0, 2)

  let couldJungle = summonerSpells.indexOf("Smite") > -1

  let itemsList = tossItems(
    shuffle(items.allInMap(mapID)),
    champion,
    couldJungle
  )

  return {
    type: types.NEW_BRAVERY,
    mapID: mapID,
    championID: champion,
    itemList: itemsList,
    boot: shuffle(items.allInGroup("boot"))[0],
    summonerSpells: summonerSpells
  }
}
