import React from 'react'
import { createStore } from 'redux'
import { Provider, connect } from 'react-redux'
import './WindowContainer.less'

import * as displays from 'Displays'
import DropdownSelector from 'common/DropdownSelector'

let allReducers = Object.keys(displays)
  .map(d => displays[d].reducer)
  .filter(d => d) // Drop falsey

let mergeObjects = (memory, next) => { return {...memory, ...next} }

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
      let newStates = allReducers.map(f => f(state, action))
      if (state === undefined) {
        newStates = newStates.filter(s => s) // Drop undefined or the like
        newStates.push({background: 'Galio'})
        state = {}
      }
      return newStates.reduce(mergeObjects, state)
    },
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
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
