import React from 'react'
import { createStore } from 'redux'
import { Provider, connect } from 'react-redux'
import './WindowContainer.less'

import * as displays from 'Displays'
import DropdownSelector from 'common/DropdownSelector'

let allReducers = Object.keys(displays)
  .map(d => displays[d].reducer)
  .filter(d => d) // Drop falsy

let SurroundingDisplay = ({background, children, currentWindow, setState}) => {
  let location = `splash/${background}_0.jpg`
  let base = 'http://ddragon.leagueoflegends.com/cdn/img/champion'
  let style = {
    backgroundImage: `url(${base}/${location})`
  }
  return (
    <div className='WindowContainer' style={style}>
      <div className='Header'>
        <DropdownSelector
          items={Object.keys(displays)}
          defaultValue={currentWindow}
          events={{
            onChange: event => setState({selectedWindow: event.target.value})
          }}
        />
      </div>
      {{...React.cloneElement(children, {className: 'Content'})}}
      <div className='Footer'>Hello Footer!</div>
    </div>
  )
}

let mapStateToProps = (state, ownprops) => {
  return {
    ...ownprops,
    background: state.background
  }
}
SurroundingDisplay = connect(mapStateToProps)(SurroundingDisplay)

export default class WindowContainer extends React.Component {

  constructor () {
    super()
    this.state = {
      selectedWindow: 'Bravery'
    }
  }

  store = createStore(
    (state, action) => {
      if (state === undefined) {
        let hydrate = allReducers.map(r => r(state, action))
        hydrate.push({background: 'Galio'})
        hydrate = hydrate.reduce(
          (state, newstate) => {
            return Object.assign({}, state, newstate)
          },
          {}
        )
        return hydrate
      } else {
        let remap = allReducers.map(r => r(state, action))
          .reduce((state, newstate) => Object.assign({}, state, newstate), state)

        return remap
      }
    }
  )

  render () {
    let Window = displays[this.state.selectedWindow].MainWindow

    return (
      <Provider store={this.store}>
        <SurroundingDisplay setState={(s) => this.setState(s)} currentWindow={this.state.selectedWindow}>
          <Window />
        </SurroundingDisplay>
      </Provider>
    )
  }
}
