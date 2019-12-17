import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import App from "./App"
import * as serviceWorker from "./serviceWorker"
import { DDragonContext } from "components/DDragon"

const rootElement = document.getElementById("root")

fetch("/data/ddragon-version.json")
  .then(response => response.json())
  .then(version => {
    ReactDOM.render(
      <React.StrictMode>
        <DDragonContext.Provider value={{ version }}>
          <App />
        </DDragonContext.Provider>
      </React.StrictMode>,
      rootElement,
    )
  })
  .catch(reason => {
    ReactDOM.render(
      <div>
        <div>Couldn't get the ddragon version!</div>
        <div>{JSON.stringify(reason)}</div>
      </div>,
      rootElement,
    )
  })

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()
