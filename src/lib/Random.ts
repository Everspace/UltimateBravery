/**
 * Returns a random item from a thing
 * @param thing thing to select from
 * @example
 *  roll([1,2,3,4,5]) // 4
 *  roll({a: 2, b: 3, x: 4}) // 3
 */
export function roll<T>(thing: Record<any, T> | T[]): T {
  if (thing instanceof Array) {
    let index = Math.floor(Math.random() * thing.length)
    return thing[index]
  } else {
    // I assume it's an object.
    let list = Object.keys(thing)
    let id = roll(list)
    return thing[id]
  }
}

/**
 * Returns a new array of randomized items
 * @param arr Array to shuffle
 */
export function shuffle(arr: any[]): any[] {
  const newArray = [...arr]
  let temp

  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    temp = newArray[i]
    newArray[i] = newArray[j]
    newArray[j] = temp
  }

  return newArray
}
