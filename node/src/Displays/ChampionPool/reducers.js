import * as types from './types'

// defaultState = {
//   assert that window.dd exists?
//   should probably transition to using state instead
//   champions: {
//    id: true//false
//   }
// }

const newState = (state) => {
  return {
    ...state,
    champions: {
      ...state.champions
    }
  }
}

function setChampion (state, action) {
  let s = newState(state)
  s.champions[action.id] = action.state
  return s
}

function toggleChampion (state, action) {
  let s = newState(state)
  s.champions[action.id] = !(state.champions[action.id] || false)

  // If we enable'd this person, then set it as the background
  if (s.champions[action.id]) {
    s.background = action.id
  }

  return s
}

function setChampions (state, action) {
  let s = newState(state)
  let ids = action.ids

  if (ids === 'all') {
    ids = window.dat.champions.allChampions
  }
  ids.forEach((id) => {
    s.champions[id] = action.enabled
  })

  return s
}

function enableChampionRole (state, action) {
  let s = newState(state)
  let champdata = window.dat.champions
  champdata.allChampions.filter(
    (id) => champdata.data[id].tags.indexOf(action.role) > -1
  ).forEach((id) => {
    s.champions[id] = true
  })

  return s
}

function reducer (state, action) {
  switch (action.type) {
    case types.SET_CHAMPION:
      return setChampion(state, action)

    case types.TOGGLE_CHAMPION:
      return toggleChampion(state, action)

    case types.SET_CHAMPIONS:
      return setChampions(state, action)

    case types.ENABLE_CHAMPION_ROLE:
      return enableChampionRole(state, action)

    default:
      return state
  }
}

export default reducer

