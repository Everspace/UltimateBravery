import React from 'react'
import { createStore } from 'redux'
import { Provider, connect } from 'react-redux'
import * as displays from 'Displays'
import './WindowContainer.less'

let SurroundingDisplay = ({background, children}) => {
  let location = `splash/${background}_0.jpg`
  let base = 'http://ddragon.leagueoflegends.com/cdn/img/champion'
  let style = {
    backgroundImage: `url(${base}/${location})`
  }
  return (
    <div className='WindowContainer' style={style}>
      <div className='Header'>Hello Header!</div>
      {{...React.cloneElement(children, {className: 'Content'})}}
      <div className='Footer'>Hello Footer!</div>
    </div>
  )
}

let mapStateToProps = (state) => { return { background: state.background } }
SurroundingDisplay = connect(mapStateToProps)(SurroundingDisplay)

export default class WindowContainer extends React.Component {
  store = createStore(
    displays.ChampionPool.reducer,
    {
      background: 'Galio',
      champions: window.dat.champions.allChampions.reduce((memory, id) => { memory[id] = true; return memory }, {})
    }
  )
  render () {
    let Window = displays.ChampionPool.MainWindow

    return (
      <Provider store={this.store}>
        <SurroundingDisplay>
          <Window />
        </SurroundingDisplay>
      </Provider>
    )
  }
}
