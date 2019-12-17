/** @jsx jsx */
import { jsx, css } from "@emotion/core"
import { Panel } from "components/Panel"
import { NavLink } from "react-router-dom"
import { fullHeight, championSplashBackground } from "style/Util"

export const containerFraction = (n: number) =>
  `${n.toFixed(2)}fr auto ${n.toFixed(2)}fr`

const containerStyle = css({
  display: "grid",
  backgroundImage:
    "url(http://ddragon.leagueoflegends.com/cdn/img/champion/splash/Galio_0.jpg)",
  maxWidth: "100%",
  gridTemplateAreas: `
    "header"
    "content"
    "footer"
  `,
  gridTemplateRows: containerFraction(0.05),
})

export const Container: React.FC<{}> = ({ children }) => (
  <div
    css={[championSplashBackground, fullHeight, containerStyle]}
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
    >
      |<NavLink to="/">Home</NavLink>|<NavLink to="/items">Items</NavLink>|
    </Panel>
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
    >
      Bravery.lol was created under Riot Games' "Legal Jibber Jabber" policy
      using assets owned by Riot Games. Riot Games does not endorse or sponsor
      this project.
    </Panel>
  </div>
)
