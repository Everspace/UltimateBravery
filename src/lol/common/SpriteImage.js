import React, { PropTypes } from 'react';

class SpriteImage extends React.Component {


    render() {
    	let dd = this.props.dd

    	let elementStyle = {
		    width: this.props.image.w,
		    height: this.props.image.h,
		    background: `url('${dd.cdn}/${dd.version}/img/sprite/${this.props.image.sprite}')`,
		    backgroundPositionX: -this.props.image.x,
		    backgroundPositionY: -this.props.image.y,
		    backgroundRepeat: "no-repeat"
    	};

    	return <div className='SpriteImage' style={elementStyle}></div>;
    }
}

SpriteImage.propTypes = {
    image: PropTypes.object.isRequired
}

export default SpriteImage;