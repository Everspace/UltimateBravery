import * as types from './types'
import * as ChampionHandler from './ChampionHandlers'

let toName = (itemID) => window.dat.items.data[itemID].name

function doTheBravery (state, action) {
  let newState = {
    bravery: Object.assign({}, action, {
      itemList: [
        action.boot,
        ...action.itemList.slice(0, 5)
      ]
    }),
    background: action.championID
  }

  return {...state, ...newState}
}

function reducer (state, action) {
  if (state === undefined) {
    return {
      bravery: {}
    }
  }
  switch (action.type) {
    case types.NEW_BRAVERY:
      return doTheBravery(state, action)

    default:
      return state
  }
}

export default reducer
