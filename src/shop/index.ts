export default class Shop {
  config: any = {};
  shops: any = [];
  paths: any = [];
  pathsNumber: number = 0;

  constructor(config: any) {
    Object.assign(this, {config});

    this.shops = this.createList();
  };

  createList() {
    const { totalShops, centers } = this.config;

    return [...new Array(totalShops)].map((shop, index) => ({
      id : index + 1,
      paths: this.getPaths(index + 1),
      fishes: this.getFishes(index),
    }));
  }

  findById(id: number) {
    return this.shops.find((shop: any) => shop.id === id);
  }

  getFishes(shopId: number) {
    const { centers } = this.config;

    return centers[shopId].reduce((acc: any, current: any) => (         
      acc + (2 ** (current - 1))
    ), 0);
  }

  getPaths(shopId: number) {
    let paths;
    paths = this.config.roads.map((road: any) => {
      const [from, to, time] = road;

      if (from === shopId || to === shopId) {
        return {from, to, time};
      }
      
    }).filter((road: any) => road);

    paths = paths.reduce((acc: any, current: any) => {
      if (current.from === shopId) {
        acc.targets.push(current);
      }

      if (current.to === shopId) {
        acc.origins.push(current);
      }

      return acc;
    }, {origins: [], targets: []});

    return paths;
  }

  followPaths(target: number) {
    const shop = this.shops.find((shop: any) => shop.id === target);
    const { origins } = shop.paths;

    origins.forEach((origin: any, index: number) => {
      const path = this.paths.find((path: any) => (
        JSON.stringify(path) === JSON.stringify(origin)
      ));

      if (!path) {
        this.paths.push(origin);
        this.followPaths(origin.from);
      }
    });

    this.paths = this.paths.reduce((acc: any, current: any) => {
      if (this.shops.length === current.to) {
        acc.push([current]);
      }

      return acc;
    }, []);
  }

  getTime() {
    this.followPaths(this.shops.length);
    console.log('this.paths: ', this.paths);
  }
}
