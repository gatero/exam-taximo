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

export default class Shop {
  config: any = {};

  constructor(config: any) {
    Object.assign(this, {config});
  };

  getTime() {
    const { totalShops, fishTypes, centers, roads } = this.config;
    const nodes = [];

    console.log('totalShops: ', totalShops);
    console.log('fishTypes: ', fishTypes);
    console.log('centers: ', centers);
    console.log('roads: ', roads);

    for (let i = 0; i < totalShops; i++) { // make nodes
        let fishes = centers[i].reduce((sum: any, elem: any) => {
            return sum + (2 ** (elem - 1)); // convert fishes to bit mask
        }, 0);
        nodes.push(new Node(fishes));
    }

    for (let i = 0; i < roads.length; i++) { // put children
        const r = roads[i];
        nodes[r[0] - 1].children.push({
            child: nodes[r[1] - 1],
            time: r[2]
        });
        nodes[r[1] - 1].children.push({
            child: nodes[r[0] - 1],
            time: r[2]
        });
    }

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
}
