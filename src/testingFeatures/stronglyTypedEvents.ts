import { EventDispatcher, SignalDispatcher, SimpleEventDispatcher } from "strongly-typed-events";

export const stronglyTypedEvents = () => {
    let dispatcher = new SignalDispatcher();

    let a = 0;
    dispatcher.sub(ev => {
      a++;
      if (a > 2) {
        ev.stopPropagation();
      }
    });
  
    let b = 0;
    dispatcher.sub(() => { b++; });
  
    dispatcher.dispatch();
    dispatcher.dispatch();
    dispatcher.dispatch();
    dispatcher.dispatch();;
}

export class Clock {
    private _onTick = new SignalDispatcher();
    private _onSequenceTick = new EventDispatcher<number, any>();
    private _onClockTick = new EventDispatcher<Clock, number>();
    private _ticks: number = 0;
  
    constructor(public name: string, timeout: number) {
      setInterval(() => {
        this._ticks += 1;
        this._onTick.dispatch();
        this._onSequenceTick.dispatch(this._ticks, '2nd');
        this._onClockTick.dispatch(this, this._ticks);
      }, timeout);
    }
  
    public get onTick() {
      return this._onTick.asEvent();
    }
  
    public get onSequenceTick() {
      return this._onSequenceTick.asEvent();
    }
  
    public get onClockTick() {
      return this._onClockTick.asEvent();
    }
  }