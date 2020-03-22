class Node {
  fishes: any;
  children: any;
  fastestTimes: any;

  constructor(_fishes: any) {
      this.fishes = _fishes;
      this.children = [];
      this.fastestTimes = [];
  }

  addTime(_fishes: any, time: any) {
      const f = _fishes | this.fishes;
      if (this.fastestTimes[f] === undefined || time < this.fastestTimes[f]) {
          this.fastestTimes[f] = time;
          return true;
      }
      return false;
  }
}

export class ShoppingSynchronousHandler {
  nodes: any [];
  config: any = {};
  shops: any = [];

  constructor(config: any) {
    Object.assign(this, {config});
  };

  getShops() {
    const { totalShops, centers } = this.config;

    this.nodes = [...new Array(totalShops)].map((shop: any, index: number) => (
      new Node(centers[index].reduce((acc: any, current: any) => (
        acc + (2 ** (current- 1))
      ), 0))
    ));
  }

  fillShopChildren() {
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

  fillFastesTime() {
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

  getBetterTime() {
    const { totalShops, fishTypes } = this.config;
    const times = this.nodes[totalShops - 1].fastestTimes;
    let fastestTime: any = undefined;

    for (let i = 1; i < times.length; i++) {
      if (times[i] !== undefined && (fastestTime === undefined || times[i] < fastestTime)) {
        for (let j = i; j < times.length; j++) {
          if (times[j] !== undefined && ((i | j) === (2 ** fishTypes) - 1)) {
            const slowerTime = Math.max(times[i], times[j]);
            if (fastestTime === undefined || slowerTime < fastestTime) {
              fastestTime = slowerTime;
            }
          }
        }
      }
    }

    return fastestTime;
  }

  getTime() {
    this.getShops();
    this.fillShopChildren();
    this.fillFastesTime();

    return this.getBetterTime();
  }
}
