import * as types from "./types"

export function setChampion (championID, state) {
  return {
    type: types.SET_CHAMPION,
    id: championID,
    state: state
  }
}

/**
 * @param {String[]} championIDs - List of champions to set
 * @param {Boolean} enabled - True to enable the champions
 return - an action object
 */
export function setManyChampions (championIDs, enabled) {
  return {
    type: types.SET_CHAMPIONS,
    ids: championIDs,
    enabled: enabled
  }
}

export function toggleChampion (championID) {
  return {
    type: types.TOGGLE_CHAMPION,
    id: championID
  }
}

export function enableChampionRole (championRoleID) {
  return {
    type: types.ENABLE_CHAMPION_ROLE,
    role: championRoleID
  }
}
