
export default class Random {

  static roll(thing) {
        if(thing instanceof Array) {
            let index = Math.floor(Math.random() * thing.length)
            return thing[index]
        } else {
            let list = Object.keys(thing)
            let id = Random.roll(list)
            return thing[id]
        }
    }

  //Durstenfeld shuffle
  //Thanks http://stackoverflow.com/a/12646864
  static shuffle(array) {

    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    return array;
  }

}