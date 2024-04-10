export function useNestedProp(object: object) {
  return {
    get: (prop: ((context: any) => any) | string) => {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      let item: any = object;

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
    },
    set: (prop: ((context: any, value?: any) => any) | string, value: any) => {
      let item: any = object;

      if (prop instanceof Function) {
        prop(item, value);
        return;
      }

      if (item[prop] !== undefined) {
        item[prop] = value;
        return;
      }

      const props = prop.split('.');
      for (let i = 0; i < props.length; i++) {
        if (i === props.length - 1) {
          item[props[i]] = value;
        } else if (item[props[i]]) {
          item = item[props[i]];
        } else {
          item[props[i]] = {};
          item = item[props[i]];
        }
      }
    }
  }
}
