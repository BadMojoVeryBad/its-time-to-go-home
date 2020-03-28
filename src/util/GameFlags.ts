export enum GameFlag {
  OPENING_CUTSCENE_PLAYED,
  ROCKET_NOFUEL_CUTSCENE_PLAYED,
  SCENE_1_TRAVERSED,
  SCENE_2_TRAVERSED,
}

export class GameFlags {
  private flags: { [index: string]: boolean } = {};

  constructor() {

  }

  public flag(key: GameFlag): boolean {
    return this.flags[key] || false;
  }

  public setFlag(key: GameFlag): void {
    this.flags[key.toString()] = true;
  }

  public unsetFlag(key: GameFlag): void {
    this.flags[key.toString()] = false;
  }
}
