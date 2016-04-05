import React, {PropTypes} from 'react';
import SpriteImage from './SpriteImage'

class Icon extends React.Component {



	render() {
		let classes = ['Icon']
		if(this.props.addClass) {
			classes.push(this.props.addClass)
		}
		return (
			<div className={classes.join(' ')}>
				<SpriteImage image={this.props.image} dd={this.props.dd}/>
			</div>
		);
	}
}

Icon.propTypes = {
	image: PropTypes.object.isRequired
}

export default Icon