import EventEmitter from "eventemitter3";

const eventEmitter = new EventEmitter();

const Emitter = {
    on: (ev: string, fn: (...args: unknown[]) => void) =>
        eventEmitter.on(ev, fn),
    once: (ev: string, fn: (...args: unknown[]) => void) =>
        eventEmitter.once(ev, fn),
    off: (ev: string, fn?: (...args: unknown[]) => void) =>
        eventEmitter.off(ev, fn),
    emit: <T>(ev: string, payload?: T) => eventEmitter.emit(ev, payload),
};

Object.freeze(Emitter);

export default Emitter;
