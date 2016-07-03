export namespace Config {

  /**
   * Enable this if you want a lot of text to be logged to console.
   * @type {boolean}
   */
  export const VERBOSE: boolean = true;

  /**
   * Default amount of minimal ticksToLive Screep can have, before it goes to renew. This is only default value, that don't have to be used.
   * So it doesn't cover all Screeps.
   * @type {number}
   */
  export const DEFAULT_MIN_LIFE_BEFORE_NEEDS_REFILL: number = 300;

}
