import { createEvent } from "./event.js";
import { addToRange } from "./range.js";

// schema: { updatedTo: ..., repeatType: ... }
export class RepeatType {
    constructor(name) {
        this.name = name;
    }

    produceEvents(entry) {
        throw new Error("produceEvents not defined for base class");
    }

    produceUntil(entry, end) {
        let events = [];
        while(entry.repeat.updatedTo < end) {
            events.push(this.produceEvents(entry));
        }
        return events.flat();
    }
}

// schema: { weekdays: [su, mo, tu, we, th, fr, sa], updatedTo: ..., repeatType: ... }
export class WeeklyRepeat extends RepeatType {
    constructor() {
        super("weekly");
    }

    produceEvents(entry) {
        let start = new Date(entry.repeat.updatedTo);
        let weekdays = entry.repeat.weekdays;

        let events = [];

        let date = start.getDate();
        for(let i = 0; i < 7; i++) {
            let newDate = new Date(start).setDate(date + i);
            if(weekdays[newDate.getDay()]) {
                let newRange = addToRange(entry.repeat.relativeRange, newDate);
                events.push(createEvent(newRange, entry.id));
            }
        }

        return events;
    }
}

export const repeatTypes = [
    new WeeklyRepeat()
].map(rt => ({ [rt.name]: rt }));

export function getRepeatType(entry) {
    return repeatTypes[entry.repeat.repeatType];
}

export function createRepeatData(repeatData) {
    return repeatData;
}