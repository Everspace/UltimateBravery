import { css } from "styled-components"

const theme = {
  colorBase: "hsl(90, 90%, 4%)",
  colorTextBase: "hsl(45, 40%, 70%)",
  colorTextActive: "hsl(40, 50%, 90%)",
  colorBorderIntrestBase: "hsl(40, 50%, 30%)",
  colorBorderIntrestHigh: "hsl(40, 55%, 50%)",
  colorDividerBase: "hsl(0, 0%, 30%)"
}

const globalStyle = css`
  * {
    box-sizing: border-box;
    :before, :after {
      box-sizing: border-box;
    }
  }

  html, body, #app {
    width: 100%;
    height: 100%;
    min-width: 100%;
    min-height: 100%;
    margin: 0;
    padding: 0;
  }

  body {
    color: ${theme.colorTextBase};
    font-family: "Roboto, Meiryo, sans-serif"
  }
`

export default {
  theme: theme,
  globalStyle: globalStyle
}
