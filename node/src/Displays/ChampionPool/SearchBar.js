import React from "react"
import PropTypes from "prop-types"
import { Input, Button } from "common/components/Inputs"

export default class SearchBar extends React.Component {

  onClick = () => {
    this.props.onTextUpdate({target: {value: ""}})
    this.refs.SearchBar.value = ""
    if (this.props.onClear) {
      this.propsonClear({target: {value: true}})
    }
  }

  render () {
    return (
      <div className='SearchBar'>
        <Input
          // inputmode={(this.props.languageData.language === 'ja_JP')?kana:latin}
          placeholder='🔎'
          type='text'
          autoCorrect='off'
          spellCheck={false}
          onChange={this.props.onTextUpdate}
          onKeyUp={this.props.onTextUpdate}
          ref='SearchBar'
        />
        <Button onClick={this.onClick}>X</Button>
      </div>
    )
  }
}

SearchBar.propTypes = {
  onTextUpdate: PropTypes.func.isRequired,
  onClear: PropTypes.func
}

