import { AwaitFile } from './AwaitFile';

const IsPlainObject = Phaser.Utils.Objects.IsPlainObject;
const IsFunction = (obj: any) => {
  return obj && (typeof(obj) === 'function');
};

const loaderCallback = function(key: any, config: any) {
  if (IsFunction(key)) {
    const callback = key;
    const scope = config;
    config = {
      config: {
        callback,
        scope,
      },
    };
  } else if (IsPlainObject(key)) {
    config = key;
    if (!config.hasOwnProperty('config')) {
      config = {
        config,
      };
    }
  } else {
    config = {
      key,
      config,
    };
  }

  // This is a mixin, so 'this' will be in scope at runtime.
  // @ts-ignore
  this.addFile(new AwaitFile(this, config));

  // @ts-ignore
  return this;
};

export default loaderCallback;
