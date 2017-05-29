import * as types from "./types"
import * as championReducer from "./championReducers"
import * as items from 'lol/Items'

const addItem = (limits, ary, itemID) => {
  // Exit if the item is already inside.
  if (ary.indexOf(itemID) !== -1) {
    return false
  }

  // get the group (if any) it goes to
  let group = items.getLimitGroup(itemID)

  // then deal with it if it is a limitable thing
  if (group) {
    if (limits[group] < 1) {
      return false //  I can't add it, so exit.
    } else {
      // deincrement the particular group
      limits[group] -= 1
    }
  }

  ary.push(itemID)
  return true
}

function fillWithItems (currentItems, action) {
  let limits = {...window.dat.items.limits}

  // If there is a boot in the action, add it.
  if (action.boot) {
    addItem(limits, currentItems, action.boot)
  }

  for (var index = 0; index < action.itemList.length; index++) {
    if (currentItems.length === 6) {
      break
    }
    addItem(limits, currentItems, action.itemList[index])
  }
}

function bravery (state, action) {
  let newState = {
    background: action.championID,
    bravery: {}
  }

  // Seed current bravery with the one from the champion reducer if possible
  if (championReducer[action.championID]) {
    newState.bravery = championReducer[action.championID](state, action) || {}
  }

  // Provide a default list if we didn't get one out of the reducer
  newState.bravery.itemList = newState.bravery.itemList || []

  fillWithItems(newState.bravery.itemList, action)

  return {...state, ...action, ...newState}
}

function reducer (state, action) {
  if (state === undefined) {
    return {
      bravery: {}
    }
  }

  switch (action.type) {
    case types.NEW_BRAVERY:
      return bravery(state, action)
    default:
      return {}
  }
}

export default reducer
