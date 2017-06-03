import { SpriteImage } from "lol/Sprite"

/**
 * A crapton of functions for dealing with items
 */
const funcs = {
  getItemDB: () => window.dat.items,
  idToObj: (itemID) => funcs.getItemDB().data[itemID],

  idToName: (itemID) => funcs.idToObj(itemID).name,

  allItemGroups: () => Object.keys(funcs.getItemDB().group),

  allInGroup: (groupID) => funcs.getItemDB().group[groupID],

  allMaps: () => Object.keys(funcs.getItemDB().map),
  allInMap: (mapID) => funcs.getItemDB().map[mapID],

  getLimitGroup: (itemID) =>
    Object.keys(funcs.getItemDB().limits)
          .find((group) => funcs.isValidInGroup(itemID, group)),

  namify: (list) => list.map(funcs.idToName),

  isValidInMap: (itemID, mapID) => funcs.allInMap(mapID).indexOf(itemID) >= 0,

  filterForMap: (mapID) => (itemID) => funcs.isValidInMap(itemID, mapID),

  isValidInGroup: (itemID, groupID) => funcs.allInGroup(groupID).indexOf(itemID) >= 0,

  filterForGroup: (groupID) =>
    (possibleItemIDs) =>
      possibleItemIDs.filter(itemID => funcs.isValidInGroup(itemID, groupID)),

  dropAllInGroup: (possibleItemIDs, groupID) =>
    possibleItemIDs.filter(itemID => !funcs.isValidInGroup(itemID, groupID)),

  filterForChampion: (possibleItemIDs, championID, couldJungle) => {
    let champion = window.dat.champions.data[championID]
    let validIDs = possibleItemIDs.slice(0) // Clone everything to start with
    // Remove everything that actually influences the bravery based on
    // attributes we know

    validIDs = champion.isMelee ? validIDs : funcs.dropAllInGroup(validIDs, "melee")
    validIDs = champion.isRange ? validIDs : funcs.dropAllInGroup(validIDs, "range")
    validIDs = couldJungle ? validIDs : funcs.dropAllInGroup(validIDs, "jungle")

    // Remove Boots because we grab those from elsewhere
    validIDs = funcs.dropAllInGroup(validIDs, "boot")

    // Remove champion unique because nobody will willingly
    // want things baught with silver serpents.
    validIDs = funcs.dropAllInGroup(validIDs, "championUnique")

    return validIDs
  }
}
Object.freeze(funcs)
export default funcs

export const ItemSprite = SpriteImage.extend`
    border-radius: 10px;
    margin: 0.2em;
  `
