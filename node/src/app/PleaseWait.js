import React from 'react'
import Random from 'common/Random'

let sayings = [
  'Feeding poros',
  'Nerfing Irelia',
  'Confiscating cigars',
  'Turning off tridiminium obluator',
  'Working out',
  'Finding Tibbers',
  'RISING SHURIMA',
  '~bard noises~'
]

export default class PleaseWait extends React.Component {

  render () {
    return <p>{Random.roll(sayings)}</p>
  }
}
