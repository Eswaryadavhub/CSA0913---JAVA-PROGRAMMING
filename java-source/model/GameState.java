package model;

/**
 * Enumeration representing global lifecycle states of the Tower Defence simulation.
 * Used by GameController, UI dialogs, and rendering state switches.
 */
public enum GameState {
    START_MENU,
    PLAYING,
    PAUSED,
    GAME_OVER,
    VICTORY
}
