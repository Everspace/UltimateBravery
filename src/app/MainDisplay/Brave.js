
/**
* A container to hold all the things that describe a run of
* ULTIMATE BRAVERY.
*
* Each array is
*/
export default class Brave {

  constructor() {
    this.champion = {id:'Kindred'} //The best champion

    /**What summoner spells am I using?*/
    this.summonerspells = []

    /**What order do I level skills?*/
    this.skills = []

    /**Like what order to evolve Kha'Zix's things*/
    this.extraSkills = []

    /**What items do I get in what order?*/
    this.items = []

    /**Get things like Gangplank's Silver Serpent Ult upgrades*/
    this.extraItems = []

    this.masteries = {
      offense:  0,
      defense:  0,
      utility:  0,
      keystone: null
    }
  }
}