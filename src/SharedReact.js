var getImageSpriteStyleBlob = function(imageData) {
  var blob = {
    width: imageData.w,
    height: imageData.h,
    background: `url('${dd_cdn}/${dd_version}/img/sprite/${imageData.sprite}')`,
    backgroundPositionX: -imageData.x,
    backgroundPositionY: -imageData.y,
    backgroundRepeat: "no-repeat"
  };
  return blob;
}

var getImageFullStyleBlob = function(imageData) {
  var blob = {
    width: imageData.w,
    height: imageData.h,
    background: `url('${dd_cdn}/${dd_version}/img/${imageData.group}/${imageData.full}')`
  };
  return blob;
}

var LeagueIcon = React.createClass({
  displayName: "LeagueIcon",

  render: function() {
    var type = this.props.type || ''

    var properties = {
      className: `LeagueIcon ${this.props.type} ${this.props.id} `,
      style: getImageSpriteStyleBlob(this.props.image)
    }

    return R.div(properties);
  }
});