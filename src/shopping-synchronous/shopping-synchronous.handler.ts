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

  config: any = {};
  shops: any = [];

  constructor(config: any) {
    Object.assign(this, {config});
  };

  getShops() {
    const { totalShops, centers } = this.config;

    return [...new Array(totalShops)].map((shop: any, index: number) => (
      new Node(centers[index].reduce((acc: any, current: any) => (
        acc + (2 ** (current- 1))
      ), 0))
    ));
  }

  fillShopChildren(nodes: any) {
    const { roads } = this.config;

    roads.forEach((road: any, index: number) => {
      nodes[road[0] - 1].children.push({
        child: nodes[road[1] - 1],
        time: road[2]
      });
      nodes[road[1] - 1].children.push({
        child: nodes[road[0] - 1],
        time: road[2]
      });
    });

    return nodes;
  }

  fillFastesTime(nodes: any) {
    const nodesToUpdate = new Set();
    nodes[0].addTime(0, 0);
    nodesToUpdate.add(nodes[0]);

    while (nodesToUpdate.size > 0) { // fill out fastest times
      const node: any = Array.from(nodesToUpdate)[0];
      nodesToUpdate.delete(node);

      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        let didUpdate = false;
        node.fastestTimes.forEach((time: any, index: any) => {
          if (child.child.addTime(index, time + child.time)) {
            didUpdate = true;
          }
        });
        if (didUpdate) {
          nodesToUpdate.add(child.child);
        }
      }
    }

    return nodes;
  }

  getBetterTime(nodes: any) {
    const { totalShops, fishTypes } = this.config;
    const times = nodes[totalShops - 1].fastestTimes;
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
    const { totalShops, fishTypes, centers, roads } = this.config;

    let nodes = this.getShops();
    nodes = this.fillShopChildren(nodes);
    nodes = this.fillFastesTime(nodes);

    return this.getBetterTime(nodes);
  }
}
