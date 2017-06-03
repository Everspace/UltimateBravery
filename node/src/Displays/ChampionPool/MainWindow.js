import React from "react"
import { connect } from "react-redux"

import { ChampionSpriteImage } from "lol/ChampionComponents"
import { AppWindowContent } from "common/components/FlexboxAppWindow"
import { GlassPanel } from "common/components/Panels"
import { Button } from "common/components/Inputs"
import styled, { css } from "styled-components"
import { mobileSwitch, hoverGuard } from "common/Media"

import SearchBar from "./SearchBar"
import * as actions from "./actions"

// this.props.champions

let ChampionPoolContent = AppWindowContent.extend`
  transition: all 0.2s ease 0s;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1em;
`

let ContentArea = GlassPanel.extend`
  justify-content: center;
  max-height: 100%;
  overflow-y: hidden;
`

let OptionsArea = GlassPanel
let ChampionArea = GlassPanel.extend`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: auto;
  margin-top: 1em;

  max-height: 500px;
  overflow-y: auto;
`

let ChampIcon = ChampionSpriteImage.extend`
  margin: 0.1em;
  transition: all 0.2s ease 0s;
  border: 1px solid ${props => props.theme.colorBorderIntrestBase};

  ${mobileSwitch.desktop`zoom: 100%;`}
  ${mobileSwitch.mobile`zoom: 125%;`}

  //On
  filter: grayscale(0%) brightness(1);

  ${hoverGuard.hoverable`
    :hover {
      filter: brightness(1.2);
    }
  `}

  :active {
    border-color: ${props => props.theme.colorBorderIntrestHigh};
    filter: grayscale(75%) brightness(1.5);
  }

  //Off
  &[disabled] {
    filter: grayscale(100%) brightness(0.65);
    ${hoverGuard.hoverable`
      :hover {
        filter: grayscale(100%) brightness(1.2);
      }
    `}
  }
`

const mapStateToProps = (state) => {
  return {
    champions: state.champions
  }
}

class MainWindow extends React.Component {
  constructor () {
    super()
    this.state = {
      filter: ""
    }
  }

  roles = [
    "Assassin",
    "Fighter",
    "Marksman",
    "Mage",
    "Support",
    "Tank"
  ]

  idToName = window.dat.champions.allChampions.reduce((memory, id) => {
    memory[id] = window.dat.champions.data[id].name.toLowerCase()
    return memory
  }, {})

  onTextUpdate = (event) => {
    this.setState({
      filter: new RegExp(`\\b${event.target.value}`, "i")
    })
  }

  searchFilterChampions = (id) => {
    return this.idToName[id].search(this.state.filter) > -1
  }

  makeRoleButton = (role) => {
    let properties = {
      key: role,
      value: role,
      onClick: () => this.props.enableChampionRole(role)
    }

    return (<Button {...properties}>
      {window.dat.languages.data[role]}
    </Button>)
  }

  makeChampionButton = (id) => {
    let button = <ChampIcon
      key={id}
      id={id}
      onClick={() => this.props.toggleChampion(id) }
      disabled={this.props.champions[id] ? null : true}
    />
    return button
  }

  render () {
    return (
      <ChampionPoolContent>
        <ContentArea>
          <OptionsArea>
            <SearchBar onTextUpdate={this.onTextUpdate} />
            <div>
              <Button
                key='enableAll'
                onClick={() => this.props.setManyChampions("all", true)}
              >ENABLE ALL!</Button>
              <Button
                key='disableAll'
                onClick={() => this.props.setManyChampions("all", false)}
              >DISABLE ALL!</Button>
            </div>
            <div className='Roles'>
              {this.roles.map(this.makeRoleButton)}
            </div>
          </OptionsArea>
          <ChampionArea>
            {
              window.dat.champions.allChampions
              .sort((a, b) => this.idToName[a].localeCompare(this.idToName[b]))
              .filter(this.searchFilterChampions)
              .map(this.makeChampionButton)
            }
          </ChampionArea>
        </ContentArea>
      </ChampionPoolContent>
    )
  }
}

export default connect(
  mapStateToProps, actions
)(MainWindow)
