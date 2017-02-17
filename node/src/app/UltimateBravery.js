import $ from 'jquery';
import React from 'react'
import MainDisplay from 'app/MainDisplay/MainDisplay'
import DebugItems from 'app/DebugItems'
import ChampionPool from './ChampionPool'
import DataDragon from './DataDragon'
import PleaseWait from './PleaseWait'
import StorageManager from 'common/StorageManager'
import DropdownSelector from 'common/DropdownSelector'

import './UltimateBravery.less'

export default class UltimateBravery extends React.Component {

  // changeLanguage(newLanguage)
  //    this.changeState({window: <PlzWait />}
  //    DataDragon.new(this.realm, newLanguage, this.onLanguageUpdate)
  // onLanguageUpdate(ddrag)
  //    this.changeState({window: <BraveryWindow />})

  constructor() {
    super()
    this.loadUser = this.loadUser.bind(this)
    this.saveUser = this.saveUser.bind(this)
    this.modifyUser = this.modifyUser.bind(this)
    this.dataDragonUpdated = this.dataDragonUpdated.bind(this)
    this.init = this.init.bind(this)
    this.state = {
      display: 'PleaseWait'
    }
  }

  componentDidMount() {
    DataDragon.update(null, null, this.init)
  }

  init() {
    this.setState({
      user: this.loadUser(),
      display: 'MainDisplay',
      champions: window.dat.champions,
      languages: window.dat.languages,
      items: window.dat.items,
      dd: window.dd
    })
  }

  saveUser() {
    if(this.state && this.state.user) {
      StorageManager.saveObject('user', this.state.user)
    }
  }

  loadUser() {
    console.log("loading user")
    let defaultUser = {
      championData: {},   //YOU HAVE NOTHING
      itemData: {},
      lolMap: '11',        //Is current summoner's rift
      summonerLevel: 30
    }

    let user = StorageManager.loadObject('user', defaultUser)
    console.log(user)
    user.championData = window.dat.champions.ubrave.ids.reduce((mem,id)=>{
        let champStatus = user.championData[id]
        mem[id] = champStatus || false
        return mem
      },{})

    return user
  }

  setChampionData(state) {
    this.modifyUser('championData', state)
  }

  setSelectedMap(state) {
    this.modifyUser('lolMap', state)
  }

  modifyUser(key, value) {
    let newUserState = {}

    if(value instanceof Object) {
      //Merge the key target and the new values togethereerrrr
      newUserState[key] = Object.assign({}, this.state.user[key], value)
    } else {
      newUserState[key] = value
    }


    //Glue new and old state together
    this.setState({
      user: Object.assign({}, this.state.user, newUserState)
    })
    this.saveUser()
  }

  dataDragonUpdated() {
    console.log("DataDragon updated, refangling state")
    this.setState({
      items: window.dat.items,
      display: 'MainDisplay',
      champions: window.dat.champions,
      languages: window.dat.languages,
      dd: window.dd
    });
  }

  render() {
    let style = {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center'
    }

    let defaultProps = {
      user: this.state.user,
      championData: this.state.champions,
      itemData: this.state.items,
      userData: this.state.user,
      languageData: this.state.languages,
      dd: this.state.dd
    }

    let choices = {
      MainDisplay: {
        item: MainDisplay
      },
      DebugItems: {
        item: DebugItems
      },
      PleaseWait: {
        item: PleaseWait
      },
      ChampionPool: {
        item: ChampionPool,
        props: {
          setChampionData: this.setChampionData.bind(this)
        }
      }
    }
    let choice = choices[this.state.display]
    let DisplayedThing = choice.item
    let combinedProps = Object.assign({}, defaultProps, choice.props)

    switch(this.state.display){
      case 'PleaseWait':
        return(<DisplayedThing/>)
        break;
      default:
        return(
          <div className='UltimateBravery'>
            <div className='Menu'>
              <DropdownSelector
                items={['en_US', 'ja_JP', 'es_MX']}
                defaultValue={window.dd.language}
                languageData={this.state.languages.data}
                transformKey={(lang)=>`native_${lang.split('_')[0]}`}
                events={{
                  onChange: (event)=>{
                    DataDragon.update(null, event.target.value, this.dataDragonUpdated)
                    this.setState({display:'PleaseWait'})
                  }
                }}
              />
              <DropdownSelector
                items={Object.keys(choices)}
                events={{
                  onChange: (event)=>this.setState({display: event.target.value})
                }}
              />
            </div>

            <DebugItems {...combinedProps} />
          </div>
      )
      break;
    }
  }
}
