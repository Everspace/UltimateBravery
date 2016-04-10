export default class Brave {
  constructor() {
    this.summonerspells = []

    this.skills = []
    //Like what order to evolve Kha'Zix's things
    this.extraSkills = []

    this.items = []
    //Like Gangplank's silver serpents
    this.extraItems = []
    this.masteries = {
      offense:  0,
      defense:  0,
      utility:  0,
      keystone: null
    }
  }
}