import 'phaser';

const FILE_POPULATED = Phaser.Loader.FILE_POPULATED;

/**
 * This is a modified version of the following code:
 * https://github.com/rexrainbow/phaser3-rex-notes/tree/master/plugins/loader/awaitloader
 */
export class AwaitFile extends Phaser.Loader.File {
  constructor(loader: any, fileConfig: any) {
    if (!fileConfig.hasOwnProperty('type')) {
      fileConfig.type = 'await';
    }
    if (!fileConfig.hasOwnProperty('url')) {
      fileConfig.url = '';
    }
    if (!fileConfig.hasOwnProperty('key')) {
      fileConfig.key = (new Date()).getTime().toString() + Math.floor(Math.random() * 1000000);
    }
    super(loader, fileConfig);
  }

  public load() {
    if (this.state === FILE_POPULATED) {
      //  Can happen for example in a JSONFile if they've provided a JSON object instead of a URL
      this.loader.nextFile(this, true);
    } else {
      // start loading task
      const config = this.config;
      const callback = config.callback;
      const scope = config.scope;
      const successCallback = this.onLoad.bind(this);
      const failureCallback = this.onError.bind(this);
      if (callback) {
        if (scope) {
          callback.call(scope, successCallback, failureCallback);
        } else {
          callback(successCallback, failureCallback);
        }
      } else {
        this.onLoad();
      }
    }
  }

  public onLoad() {
    this.loader.nextFile(this, true);
  }

  public onError() {
    this.loader.nextFile(this, false);
  }
}
