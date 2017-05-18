import React from 'react'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import * as displays from 'Displays'
import './WindowContainer.less'

const WindowContainer = () => {
  console.log(displays)
  let Window = displays.ChampionPool.MainWindow
  let initialState = {
    champions: window.dat.champions.allChampions.reduce((memory, id) => { memory[id] = true; return memory }, {})
  }

  let store = createStore(
    displays.ChampionPool.reducer,
    initialState
  )

  return (
    <Provider store={store}>
      <div className='WindowContainer'>
        <div className='Header'>Hello</div>
        <div className='Content'>
          <Window />
        </div>
        <div className='Footer'>Hello</div>
      </div>
    </Provider>
  )
}

export default WindowContainer
