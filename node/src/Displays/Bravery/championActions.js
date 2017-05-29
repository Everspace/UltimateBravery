import * as Random from "common/Random"

/*
 * All of these champion specific actions
 *  - take the current action to be dispatched to redux
 *  - return the action but better
 *
 * Any champion that needs another "random" component should generate it
 * here, and then fiddle with the choices in championReducers.
 */

export const Cassiopeia = (action) => {
  return {
    ...action,
    boot: null
  }
}

export const Gangplank = (action) => {
  return {
    ...action,
    serpentItems: Random.shuffle(["3901", "3902", "3903"])
  }
}

export const Khazix = (action) => {
  return {
    ...action,
    evolve: Random.shuffle(...Array(4).keys())
  }
}
