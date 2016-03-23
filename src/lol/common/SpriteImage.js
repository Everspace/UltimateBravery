import React, { PropTypes } from 'react';

class SpriteImage extends React.Component {


    render() {
    	let dd = this.props.dataDragon

    	let elementStyle = {
		    width: this.props.w,
		    height: this.props.h,
		    background: `url('${dd.cdn}/${dd.version}/img/sprite/${this.props.sprite}')`,
		    backgroundPositionX: -this.props.x,
		    backgroundPositionY: -this.props.y,
		    backgroundRepeat: "no-repeat"
    	};

    	return <div className='SpriteImage' style={elementStyle}></div>;
    }
}

SpriteImage.propTypes = {
	w: PropTypes.number.isRequired,
	h: PropTypes.number.isRequired,
	x: PropTypes.number.isRequired,
	y: PropTypes.number.isRequired,
	sprite: PropTypes.string.isRequired
}

export default SpriteImage;