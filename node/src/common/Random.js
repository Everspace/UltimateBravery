/**
* A convienience module to handle rolling things.
*/

/**
* Selects 1 random thing out of a container.
*/
export const roll = (thing) => {
  if (thing instanceof Array) {
    let index = Math.floor(Math.random() * thing.length)
    return thing[index]
  } else { // I assume it's an object.
    let list = Object.keys(thing)
    let id = roll(list)
    return thing[id]
  }
}

export const shuffle = (array) => {
  let newArray = [...array]

  for (var i = newArray.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1))
    var temp = newArray[i]
    newArray[i] = newArray[j]
    newArray[j] = temp
  }

  return newArray
}
