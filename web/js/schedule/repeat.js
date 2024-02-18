export class RepeatType {
    constructor(name) {
        this.name = name;
    }

    produceEvents(repeatData) {
        throw new Error("produceEvents not defined for base class");
    }

    initData(repeatData) {

    }
}

export class WeeklyRepeat extends RepeatType {
    constructor() {
        super("weekly");
    }

    produceEvents(repeatData) {
        let data = new Date(repeatData.updatedTo);
        let date = data.getDate();
        for(let i = 0; i < 7; i++) {
            let newdate = date + i;
            
        }
    }

    // weekdays: [su, mo, tu, we, th, fr, sa]
    initData(repeatData, weekdays) {
        repeatData.weekdays = weekdays;
    }
}

export function createRepeatData(repeatType, start, ...args) {
    return repeatTypes[repeatType].initData({ repeatType, updatedTo: start }, ...args);
}

export const repeatTypes = [

].map(rt => ({ [rt.name]: rt }));