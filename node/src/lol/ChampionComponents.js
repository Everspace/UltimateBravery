import React, { PropTypes } from "react"
import { SpriteImage } from "lol/Sprite"
import styled from "styled-components"

let champ = (id) => window.dat.champions.data[id]

export const ChampionSpriteImage = styled(
  ({ id, ...props }) => <SpriteImage {...props} image={champ(id).image} key={id} />
)`` // The `` are here so that I can use extend.

ChampionSpriteImage.propTypes = {
  id: PropTypes.string.isRequired
}

const Container = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 1em;
`

const Uppered = styled.div`
  text-transform: uppercase;
  font-variant: small-caps;
`
const Name = styled.h1`
  color: ${props => props.theme.colorTextActive};
  margin-bottom: 0;
  margin-top: 0;
`
const Epithet = styled.h3`
  /* but also - #555 however that will work */
  color ${props => props.theme.colorTextActive};

  margin-bottom: 0;
  margin-top: 0;
`

export const ChampionTitle = ({id}) =>
  <Container>
    <Uppered>
      <Name>{champ(id).name}</Name>
      <Epithet>{champ(id).title}</Epithet>
    </Uppered>
  </Container>

ChampionTitle.propTypes = {
  id: PropTypes.string.isRequired
}
