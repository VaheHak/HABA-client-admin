import { EventEmitter } from 'events';

class Emitter {

    static event = new EventEmitter();

    static on(event, cb) {
        this.event.on(event, cb)
    }

    static emit(event, ...params){
        this.event.emit(event, ...params)
    }

    static remove(event, cb) {
        this.event.removeListener(event, cb)
    }
}

export default Emitter
