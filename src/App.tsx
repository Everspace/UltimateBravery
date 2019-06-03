/** @jsx jsx */
import { jsx, Global } from "@emotion/core"
import DebugItemGrid from "components/debug/ItemGrid"
import { Panel } from "components/Panel"
import { BrowserRouter, Route, Switch } from "react-router-dom"

const PanelDemo: React.FC<{}> = () => (
  <Panel>
    0
    <Panel>
      1
      <Panel>
        2
        <Panel>
          3<Panel>4</Panel>
        </Panel>
      </Panel>
    </Panel>
  </Panel>
)

const Page404: React.FC<{}> = () => (
  <Panel>
    404! Don't check in strange pages!
    <br />
    there could be a garen lurking about!
  </Panel>
)

const fullHeight = {
  width: "100vw",
  height: "100vh",
  minHeight: "100vh",
}

const championSplashBackground = {
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center center",
  backgroundAttachment: "fixed",
  backgroundSize: "cover",
}

const Container: React.FC<{}> = ({ children }) => (
  <div
    css={[
      fullHeight,
      championSplashBackground,
      {
        display: "grid",
        backgroundImage:
          "url(http://ddragon.leagueoflegends.com/cdn/img/champion/splash/Galio_0.jpg)",
        maxWidth: "100%",
        gridTemplateAreas: `
        "header"
        "content"
        "footer"
      `,
        gridTemplateRows: "0.08fr auto 0.08fr",
      },
    ]}
    id="container"
  >
    <Panel
      depth={2}
      type="header"
      css={{
        gridArea: "header",
        borderWidth: 0,
        borderBottomWidth: 1,
        margin: 0,
      }}
    />
    <main
      css={{
        gridArea: "content",
        padding: "1em",
        overflowY: "auto",
      }}
    >
      {children}
    </main>
    <Panel
      depth={2}
      type="footer"
      css={{
        borderWidth: 0,
        borderTopWidth: 1,
        gridArea: "footer",
        margin: 0,
      }}
    />
  </div>
)

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Global
        styles={{
          "html, body, #root": {
            ...fullHeight,
          },
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
