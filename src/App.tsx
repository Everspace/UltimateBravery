/** @jsx jsx */
import { Global, jsx } from "@emotion/core"
import { Container } from "components/Container"
import DebugItemGrid from "components/debug/ItemGrid"
import { PanelDemo } from "components/debug/PanelDemo"
import { Page404 } from "components/Page404"
import { BrowserRouter, Route, Switch } from "react-router-dom"
import { fullHeight } from "style/Util"

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Global
        styles={{
          "html, body, #root": [fullHeight],
          body: {
            color: "white",
          },
        }}
      />
      <Container>
        <Switch>
          <Route exact path="/" component={PanelDemo} />
          <Route path="/items" component={DebugItemGrid} />
          <Route component={Page404} />
        </Switch>
      </Container>
    </BrowserRouter>
  )
}

export default App
