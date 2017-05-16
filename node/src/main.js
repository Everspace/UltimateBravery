import React from 'react'
import ReactDOM from 'react-dom'
import * as ChampionPool from 'Displays/ChampionPool'
import DataDragon from 'app/DataDragon'
import { createStore } from 'redux'
import { Provider } from 'react-redux'

DataDragon.update()
.then(() => {
  let initialState = {
    champions: window.dat.champions.allChampions.reduce((memory, id) => {memory[id] = true; return memory}, {})
  }

  let store = createStore(
    ChampionPool.reducer,
    initialState
  )

  let ToRender = ChampionPool.MainWindow
  ReactDOM.render(
    <Provider store={store}>
      <ToRender />
    </Provider>,
    document.getElementById('app')
  )
})
