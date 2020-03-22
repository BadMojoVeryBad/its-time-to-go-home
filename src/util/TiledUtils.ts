export abstract class TiledUtils {
  public static getProperty(object: Phaser.Types.Tilemaps.TiledObject | Phaser.Tilemaps.LayerData, property: string): any {
    let value;
    object.properties.forEach((prop: any) => {
      if (prop.name === property) {
        value = prop.value;
        return;
      }
    });
    return value;
  }
}
