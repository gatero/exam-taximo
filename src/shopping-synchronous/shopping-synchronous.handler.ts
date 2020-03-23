import Node from './shopping-synchronous.node';

/**
 * @class ShoppingSynchronousHandler
 * @description This class handle the preprocessed request to obtain the  minimum_time
 * */
export class ShoppingSynchronousHandler {
  nodes: any [];
  config: any = {};
  shops: any = [];

  /**
   * @constructs
   * @param {object} config
   * */
  constructor(config: any) {
    Object.assign(this, {config});
  };

  /**
   * @function fillShops
   * @description this create the initial state for the tree of nodes
   * each node is generated with the number of fishes by center
   * @returns {void}
   * */
  fillShops() {
    const { totalShops, centers } = this.config;

    this.nodes = [...new Array(totalShops)].map((shop: any, index: number) => (
      new Node(centers[index].reduce((acc: any, current: any) => (
        acc + (2 ** (current- 1))
      ), 0))
    ));
  }

  /**
   * @function fillShopChildren
   * @description this create the initial state for the tree of nodes
   * each node is generated with the number of fishes by centero
   * @returns {void}
   * */
  fillShopChildren(): void {
    const { roads } = this.config;

    roads.forEach((road: any, index: number) => {
      this.nodes[road[0] - 1].children.push({
        child: this.nodes[road[1] - 1],
        time: road[2]
      });
      this.nodes[road[1] - 1].children.push({
        child: this.nodes[road[0] - 1],
        time: road[2]
      });
    });
  }

  /**
   * @function fillFastesTime
   * @description Iterate the tree of nodes and set the fastesTime for each child
   * @returns {void}
   * */
  fillFastesTime(): void {
    const nodesToUpdate = new Set();
    this.nodes[0].addTime(0, 0);
    nodesToUpdate.add(this.nodes[0]);
    while (nodesToUpdate.size > 0) {
      const node: any = Array.from(nodesToUpdate)[0];
      nodesToUpdate.delete(node);
      node.children.forEach((child: any) => {
        let didUpdate = false;
        node.fastestTimes.forEach((time: any, index: any) => {
          if (child.child.addTime(index, time + child.time)) {
            didUpdate = true;
          }
        });

        if (didUpdate) {
          nodesToUpdate.add(child.child);
        }
      });
    }
  }

  /**
   * @function getBetterTime
   * @description get the minimum time that those cats will spend before they meet
   * @returns {number} minimum_time
   * */
  getBetterTime(): number {
    const { totalShops, fishTypes } = this.config;
    let times = this.nodes[totalShops - 1].fastestTimes;
    let minimum_time: number = 0;

    for (let i = 1; i < times.length; i++) {
      if (times[i] && (!minimum_time || times[i] < minimum_time)) {
        for (let j = i; j < times.length; j++) {
          if (times[j] && ((i | j) === (2 ** fishTypes) - 1)) {
            const slowerTime = Math.max(times[i], times[j]);

            if (!minimum_time || slowerTime < minimum_time) {
              minimum_time = slowerTime;
            }
          }
        }
      }
    }
    
    return minimum_time;
  }

  /**
   * @function getTime
   * @description Run the main process where the data parsers are invoked
   * once the data was iparsed ithis returns the better time
   * @returns {number} minimum_time
   * */
  getTime(): number {
    this.fillShops();
    this.fillShopChildren();
    this.fillFastesTime();

    return this.getBetterTime();
  }
}
