(function (){

var exampleData = {
    id: 'Garen',
    skin: 10,
    items: ["3078","3078","3078","3078","3078"],
    trinket: "3340",
    summonerSpells: ['SummonerBarrier','SummonerFlash'],
    skillSelection: ['W','E','Q'],
    mastery: [9,0,21],
}

var Skill = React.createClass({
  displayName: 'Item',
  render: function() {
    return R.img({
      className: 'Item',
      width: 64,
      height: 64,
      src: `${dd_cdn}/${dd_version}/img/${this.props.image.group}/${this.props.image.full}`
    });
  }
});

var Item = React.createClass({
  displayName: 'Item',
  render: function() {
    return R.img({
      className: 'Item',
      width: 64,
      height: 64,
      src: `${dd_cdn}/${dd_version}/img/${this.props.image.group}/${this.props.image.full}`
    });
  }
});

var SelectionDisplay = React.createClass({
  displayName: 'SelectionDisplay',

  render: function() {

    if (!this.props.skin) {
      this.props.skin = 0;
    }

    var items = []
    this.props.items.forEach(function(element, index, array){
      items.push(R.ce(Item, itemData.data[element]));
    });

    var skills = []
    this.props.skillSelection.forEach(function(element, index, array){
       items.push(R.ce(Skill, itemData.data[element]));
    });

    var components = R.div({className: 'jumbotron'},
      R.img({className:'BigPortrait pull-left', src: `${dd_cdn}/img/champion/loading/${this.props.id}_${this.props.skin}.jpg`}),
      R.div({className: 'content'},
        R.h1(null, championData.data[this.props.id].name, R.small(null,'- ',championData.data[this.props.id].title)),
        R.h3(null, languageData.data.categorySummoner),
        R.h3(null, languageData.data.Abilities),
        R.h3(null, languageData.data.categoryItem),
        R.div({className: 'ItemContainer'},
          items
        ),
        R.h3(null, languageData.data.categoryMastery)
      ),
      R.div({className: 'pusher'})
    )

    return components;
  }
});

  var ele = document.createElement('div')
  ele.id = 'SelectionDisplay'
  ReactDOM.render(
    R.ce(SelectionDisplay, exampleData), ele
  );
  document.getElementById('Content').appendChild(ele)
})();

/*

    	<div class="jumbotron SelectionDisplay">
				<img class="BigPortrait pull-left" src="https://ddragon.leagueoflegends.com/cdn/img/champion/loading/Garen_10.jpg"></img>
    		<div class='content'>
  				<h1>Aatrox<small>, the Darkin Blade</small></h1>
  				<h3>Summoner Spells</h3>
  				<span>&gt;</span>
  				<h3>Items</h3>
  				<h3>Skill Order</h3>
  				<h3>Mastery</h3>
  			</div>
  			<div class="pusher"></div>
			</div>
*/
