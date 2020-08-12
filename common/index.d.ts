export type CommandFrame = {
  type: 'ps2-command' | 'power-button-down' | 'power-button-up'
  ps2Command?: number[]
}
