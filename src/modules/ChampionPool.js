'use strict'
class ChampionPool extends Module {

  this.ChampionPoolAllOnButton = React.createClass({
    displayName: "ChampionPoolAllOnButton",

    handleClick: (event => 
      for(var champID in championData.data) {
        this.props.setChampionAvailability(champID, true);
      }
    ),

    render: function(event) {
      return R.button(
      {
        className: 'btn btn-default',
        onClick: this.handleClick
      },
        'All On'
      );
    }
  })

  ChampionPoolAllOffButton = React.createClass({
    displayName: "ChampionPoolAllOffButton",

    handleClick: (event => 
      for(var champID in championData.data) {
        this.props.setChampionAvailability(champID, false);
      }
    ),

    render: function(event) {
      return R.button(
      {
        className: 'btn btn-danger',
        onClick: this.handleClick
      },
        'All Off'
      );
    }
  })

  ChampionPoolIcon = React.createClass({
    displayName: "ChampionPoolIcon",

    handleClick: function(event) {
      this.props.setChampionAvailability(this.props.id, !this.props.enabled);
    },

    render: function() {
      return R.div(
      {
        className: "ChampionPoolIcon " + ((this.props.enabled) ? '' : "disabled"),
        onClick: this.handleClick
      },
        R.ce(LeagueIcon, this.props)
      );
    }
  });

  ChampionPool = React.createClass({
    displayName: "ChampionPool",

   getInitialState: function() {
      data = {};

      for(var champID in championData.data) {
        data[champID] = eval(localStorage.getItem(champID));
      }

      return data;
    },
    
    setChampionAvailability: function(champID, availability) {
      var newState = {};
      newState[champID] = availability;

      this.setState(newState);
      localStorage.setItem(champID, availability);
    },

    render: function() {
      var champBlob = [];

      var buttonProps = {
        setChampionAvailability: this.setChampionAvailability
      };

      //Grab all the champions
      for(var champID in this.props.data) {
        var data = this.props.data[champID];
        data.type = "Champion";
        data.enabled = this.state[champID];
        data.setChampionAvailability = this.setChampionAvailability;
        champBlob.push(R.ce(ChampionPoolIcon,data));
      }

      var components = R.div({className: "panel panel-primary"},
        R.div({className: "panel-heading"},
          R.div({className: "btn-group btn-group-lg pull-right"},
            R.ce(ChampionPoolAllOnButton, buttonProps),
            R.ce(ChampionPoolAllOffButton, buttonProps)
          ),
          
            R.h3(null, 'Champion Pool'),
            R.p(null, 'Enable or disable champions by clicking on their portrait')
        ),
        R.div({className: "panel-body"}, champBlob)
      );

      return components;
    }
  });
};
