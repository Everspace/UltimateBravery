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
