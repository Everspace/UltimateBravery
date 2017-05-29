/**
 * A crapton of functions for dealing with items
 */

export const getItemDB = () => window.dat.items
export const idToObj = itemID => getItemDB().data[itemID]
export const idToName = itemID => idToObj(itemID).name
export const allItemGroups = () => Object.keys(getItemDB().group)
export const allInGroup = groupID => getItemDB().group[groupID]
export const allMaps = () => Object.keys(getItemDB().map)
export const allInMap = mapID => getItemDB().map[mapID]

export const getLimitGroup = (itemID) => {
  return Object.keys(getItemDB().limits)
            .find((group) => isValidInGroup(itemID, group))
}

export const namify = (list) => list.map(idToName)
export const isValidInMap = (itemID, mapID) => allInMap(mapID).indexOf(itemID) >= 0
export const filterForMap = (mapID) => {
  return (possibleItemIDs) => possibleItemIDs.filter(itemID => isValidInMap(itemID, mapID))
}

export const isValidInGroup = (itemID, groupID) => allInGroup(groupID).indexOf(itemID) >= 0
export const filterForGroup = (groupID) => {
  return (possibleItemIDs) => possibleItemIDs.filter(itemID => isValidInGroup(itemID, groupID))
}
export const dropAllInGroup = (possibleItemIDs, groupID) => {
  return possibleItemIDs.filter(itemID => !isValidInGroup(itemID, groupID))
}

export const filterForChampion = function (possibleItemIDs, championID, couldJungle) {
  let champion = window.dat.champions.data[championID]
  let validIDs = possibleItemIDs.slice(0) // Clone everything to start with
  // Remove everything that actually influences the bravery based on
  // attributes we know
  validIDs = champion.isMelee ? validIDs : dropAllInGroup(validIDs, "melee")
  validIDs = champion.isRange ? validIDs : dropAllInGroup(validIDs, "range")
  validIDs = couldJungle ? validIDs : dropAllInGroup(validIDs, "jungle")

  // Remove Boots because we grab those from elsewhere
  validIDs = dropAllInGroup(validIDs, "boot")

  // Remove champion unique because nobody will willingly
  // want things baught with silver serpents.
  validIDs = dropAllInGroup(validIDs, "championUnique")

  return validIDs
}
