/** @jsx jsx */
import { jsx } from "@emotion/core"
import DebugItemGrid from "components/debug/ItemGrid"
import { Panel } from "components/Panel"
import { BrowserRouter, Route, Switch } from "react-router-dom"

const ExampleComponent: React.FC<{}> = () => (
  <Panel>
    <Panel />
  </Panel>
)

const Page404: React.FC<{}> = () => (
  <Panel>
    404! Don't check in strange pages!
    <br />
    there could be a garen lurking about!
  </Panel>
)

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="App">
        <Switch>
          <Route exact path="/" component={ExampleComponent} />
          <Route path="/items" component={DebugItemGrid} />
          <Route component={Page404} />
        </Switch>
      </div>
    </BrowserRouter>
  )
}

export default App
