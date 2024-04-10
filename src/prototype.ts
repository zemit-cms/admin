// eslint-disable-next-line no-extend-native
Object.defineProperty(Object.prototype, 'nestedProp', {
  value: function (prop: ((context: any) => any) | string) {

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let item: any = this;

    if (prop instanceof Function) {
      return prop(item);
    }

    if (item[prop] !== undefined) {
      return item[prop];
    }

    const props = prop.split('.');
    for (let i = 0; i < props.length; i++) {
      if (item[props[i]]) {
        item = item[props[i]];
      }
      else {
        return undefined;
      }
    }

    return item;
  }
});
