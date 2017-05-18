import React from 'react'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import * as displays from 'Displays'
import './WindowContainer.less'

export default class WindowContainer extends React.Component {
  store = createStore(
    displays.ChampionPool.reducer,
    {
      champions: window.dat.champions.allChampions.reduce((memory, id) => { memory[id] = true; return memory }, {})
    }
  )

  render () {
    let Window = displays.ChampionPool.MainWindow

    return <Provider store={this.store}>
      <div className='WindowContainer'>
        <div className='Header'>HeEElo?</div>
        <div className='Content'>
          <Window />
        </div>
        <div className='Footer'>Hello</div>
      </div>
    </Provider>
  }
}
