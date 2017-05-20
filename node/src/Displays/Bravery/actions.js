import * as types from './types'
import { shuffle } from 'common/Random'


// return a function that filters an array of badThings out of a target array
// remove3and5 = subtractUsing([3,5])
// remove3and5([1,2,3,4,5]) -> [1,2,4]
let subtractUsing = function (badThings) {
  return (targetArray) => targetArray.filter(x => badThings.indexOf(x) === -1)
}

let tossItems = function (itemList, championID, couldJungle) {
  let champion = window.dat.champions.data[championID]
  let items = window.dat.items

  // A series of functions that subtractUsing the items of the group named
  let removeGroup = Object.keys(items.group)
    .reduce((mem, groupName) => {
      mem[groupName] = subtractUsing(items.group[groupName])
      return mem
    }, {})

  // Remove everything that actually influences the bravery based on
  // attributes we know
  itemList = !champion.isMelee ? itemList : removeGroup['melee'](itemList)
  itemList = !champion.isRanged ? itemList : removeGroup['range'](itemList)
  itemList = couldJungle ? itemList : removeGroup['jungle'](itemList)

  // Remove Boots because we grab those from elsewhere
  itemList = removeGroup['boot'](itemList)

  // Remove champion unique because nobody will willingly
  // want things baught with silver serpents.
  itemList = removeGroup['championUnique'](itemList)

  return itemList
}

export const newBravery = (mapID, availableChampions) => {
  let champion = shuffle(availableChampions)[0]

  let summonerSpells = shuffle([
    'Exhaust',
    'Ignite',
    'Smite',
    'Heal',
    'Barrier',
    'Snowball',
    'Teleport',
    'Flash'
  ]).slice(0, 2)

  let couldJungle = summonerSpells.indexOf('Smite') > -1

  let items = tossItems(
    shuffle(window.dat.items.map[mapID]),
    champion,
    couldJungle
  )

  return {
    type: types.NEW_BRAVERY,
    mapID: mapID,
    championID: champion,
    itemList: items,
    boot: shuffle(window.dat.items.group.boot)[0],
    summonerSpells: summonerSpells
  }
}
