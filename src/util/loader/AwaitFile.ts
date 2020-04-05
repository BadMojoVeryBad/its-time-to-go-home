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

  load() {
    if (this.state === FILE_POPULATED) {
      //  Can happen for example in a JSONFile if they've provided a JSON object instead of a URL
      this.loader.nextFile(this, true);
    } else {
      // start loading task
      var config = this.config;
      var callback = config.callback;
      var scope = config.scope;
      var successCallback = this.onLoad.bind(this);
      var failureCallback = this.onError.bind(this);
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

  onLoad() {
    this.loader.nextFile(this, true);
  }

  onError() {
    this.loader.nextFile(this, false);
  }
}
