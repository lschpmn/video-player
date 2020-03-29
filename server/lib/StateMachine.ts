import { cloneDeep } from 'lodash';

export default class StateMachine<T extends {}> {
  private listeners: ((oldState: T) => void)[] = [];
  private _state: T = {} as T;

  get state(): T {
    return cloneDeep(this._state);
  }

  addListener(listener: (oldState: T) => void) {
    this.listeners.push(listener);
  }

  removeListener(listener: (oldState: T) => void) {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  protected updateState = (newState: T) => {
    const oldState = this.state;
    this._state = cloneDeep({
      ...oldState,
      ...newState,
    });
    this.listeners.forEach(listener => listener(oldState));
  };
}
