import React, {PropTypes} from 'react';
import SpriteImage from './SpriteImage'

class Icon extends React.Component {

	render() {
		return (
			<div className={'Icon' + (this.props.class ? ' ' + this.props.class : '')}>
				<SpriteImage 
					dataDragon={this.props.dataDragon}
					w={this.props.image.w}
					h={this.props.image.h}
					x={this.props.image.x}
					y={this.props.image.y}
					sprite={this.props.image.sprite}
				/>
			</div>
		);
	}
}

Icon.propTypes = {
	image: PropTypes.object.isRequired
}

export default Icon