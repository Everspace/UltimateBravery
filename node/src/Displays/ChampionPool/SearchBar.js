import React, {PropTypes} from 'react'

export default class SearchBar extends React.Component {

  onClick = () => {
    this.props.onTextUpdate({target: {value: ''}})
    this.refs.SearchBar.value = ''
    if (this.props.onClear) {
      this.propsonClear({target: {value: true}})
    }
  }

  render () {
    return (
      <div className='SearchBar'>
        <input
          // inputmode={(this.props.languageData.language === 'ja_JP')?kana:latin}
          placeholder='🔎'
          type='text'
          autoCorrect='off'
          spellCheck={false}
          onChange={this.props.onTextUpdate}
          onKeyUp={this.props.onTextUpdate}
          ref='SearchBar'
        />
        <button onClick={this.onClick}>X</button>
      </div>
    )
  }
}

SearchBar.propTypes = {
  onTextUpdate: PropTypes.func.isRequired,
  onClear: PropTypes.func
}

