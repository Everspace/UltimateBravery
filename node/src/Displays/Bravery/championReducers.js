/*
 * All of these champion specific reducers
 *  - take a redux state and action
 *  - return the contents of the bravery key
 */

export const Viktor = (state, action) => {
  return {
    itemList: [
      action.boot,
      "3198" // perfect hex-core
    ]
  }
}

// TODO: Implement arbitrary panels to stuff them in here
export const Gangplank = (state, action) => {
  return {}
}

// TODO: Implement arbitrary panels to stuff them in here
export const Khazix = (state, action) => {
  return {}
}
