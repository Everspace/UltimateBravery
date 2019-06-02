import * as types from "./types"

// defaultState = {
//   assert that window.dd exists?
//   should probably transition to using state instead
//   champions: {
//    id: true//false
//   }
// }

const newState = state => {
  return {
    ...state,
    champions: { ...state.champions }
  }
}

function setChampion (state, action) {
  let s = newState(state)
  s.champions[action.id] = action.state
  return s
}

function toggleChampion (state, action) {
  let newState = {
    champions: {...state.champions}
  }

  newState.champions[action.id] = !(state.champions[action.id] || false)
  console.assert(newState.champions[action.id] !== state.champions[action.id], "THE TOGGLES, THEY DO NOTHING!")

  // If we enable'd this person, then set it as the background
  if (newState.champions[action.id]) {
    newState.background = action.id
  }

  return {...state, ...newState}
}

function setChampions (state, action) {
  let s = newState(state)
  let ids = action.ids

  if (ids === "all") {
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
  if (state === undefined) {
    return {
      champions: window.dat.champions.allChampions
        .reduce((memory, id) => { memory[id] = true; return memory }, {})
    }
  }

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
      return {} // Emit no change
  }
}

export default reducer

