/**
 * @class Node
 * @description this is the representation of a node of the tree generated to find the minimum time
 * */
export default class Node {
  fishes: any;
  children: any;
  fastestTimes: any;

  /**
   * @function constructor
   * @constructs
   * @description this recives the amount of sishes and prepare the initial state of each node instance
   * @returns void
   * */
  constructor(_fishes: any) {
      this.fishes = _fishes;
      this.children = [];
      this.fastestTimes = [];
  }

  /**
   * @function addTime
   * @description this method add the time just if the time is undefined or if time is less than the current fastestTime
   * @returns {bolean}
   * */
  addTime(fishes: any, time: any) {
      const f = fishes | this.fishes;
      if (!this.fastestTimes[f] || time < this.fastestTimes[f]) {
          this.fastestTimes[f] = time;
          return true;
      }
      return false;
  }
}
