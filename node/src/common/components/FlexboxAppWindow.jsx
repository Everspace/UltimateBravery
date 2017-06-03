import styled, {css} from "styled-components"

export const AppWindow = styled.div`
  background-image: ${props => `url(${props.background})` || "none"};

  width: 100%;
  height: 100%;
  min-height: 100%;

  display: flex;
  flex-direction: column;

  justify-content: flex-start;
  /* align items in Main Axis */
  align-items: stretch;
  /* align items in Cross Axis */
  align-content: stretch;
  /* Extra space in Cross Axis */

  transition: background-image ease-in-out 0.5s,
              opacity ease-in-out 0.5s;

  background-color: black;

  background-repeat: no-repeat;
  background-position-x: center;
  background-position-y: center;
  background-attachment: fixed;
  background-size: cover;
`

export const AppHeader = styled.div`
  background: rgba(255, 0, 0, 1);
`

export const AppFooter = styled.div`
  background: rgba(0, 255, 0, 1);
`

export const AppWindowContent = styled.div`
  flex: 1;
  padding: 0.5em;
  opacity: 1;

  /* Needed for when the area gets squished too far and there is content that can't be displayed */
  transition: opacity 1s ease-in-out,
              backdrop-filter 1s ease-in-out;

  overflow: auto;
`

export const AppWindowContentEntering = css`
  opacity: 0;
  -webkit-backdrop-filter: none;
  backdrop-filter: none;
`
