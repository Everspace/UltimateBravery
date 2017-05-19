import React from 'react'
import ReactDOM from 'react-dom'
import DataDragon from 'app/DataDragon'

import { AppContainer } from 'react-hot-loader'
import WindowContainer from 'WindowContainer'
import 'whatwg-fetch'

let render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('app')
  )
}

DataDragon.update()
.then(() => {
  render(WindowContainer)
})
.then(() => {
  if (module.hot) {
    module.hot.accept('WindowContainer', () => {
      render(WindowContainer)
    })
  }
})
