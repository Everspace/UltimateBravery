import React from "react"
import PropTypes from "prop-types"
import { createStore } from "redux"
import { Provider, connect } from "react-redux"
import LolTheme from "styles/LolTheme"
import { ThemeProvider, injectGlobal } from "styled-components"
import { normalize } from "polished"

import * as displays from "Displays"
import { DropdownSelector } from "common/components/Inputs"
import { AppWindow, AppHeader, AppFooter } from "common/components/FlexboxAppWindow"

injectGlobal`
  ${normalize()}
  ${LolTheme.globalStyle}
`

let SurroundingDisplay = (props) => {
  let base = "http://ddragon.leagueoflegends.com/cdn/img/champion"
  // The double slash is a bug in ddragon to force "latest image"
  // Otherwise we get green galio which is no fun.
  let location = `splash//${props.background}_0.jpg`
  return (
    <AppWindow background={`${base}/${location}`}>
      <AppHeader>
        <DropdownSelector
          items={Object.keys(displays)}
          defaultValue={props.currentWindow}
          events={{
            onChange: event => props.setState({selectedWindow: event.target.value})
          }}
        />
      </AppHeader>
       {props.children}
      <AppFooter>Hello Footer!</AppFooter>
    </AppWindow>
  )
}
SurroundingDisplay.propTypes = {
  //children: PropTypes.arrayOf(PropTypes.element)
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
      selectedWindow: "ChampionPool"
    }
  }

  allReducers = Object.keys(displays)
                      .map(d => displays[d].reducer)
                      .filter(d => d) // Drop falsey

  store = createStore(
    (state, action) => {
      let newStates = this.allReducers.map(f => f(state, action))
      if (state === undefined) {
        newStates = newStates.filter(s => s) // Drop undefined or the like
        newStates.push({background: "Galio"})
        state = {}
      }
      return newStates.reduce(
         (memory, next) => Object.assign({}, memory, next),
         state
      )
    },
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )

  render () {
    let Window = displays[this.state.selectedWindow].MainWindow

    return (
      <Provider store={this.store}>
        <ThemeProvider theme={LolTheme.theme}>
          <SurroundingDisplay setState={(s) => this.setState(s)} currentWindow={this.state.selectedWindow}>
            <Window />
          </SurroundingDisplay>
        </ThemeProvider>
      </Provider>
    )
  }
}
