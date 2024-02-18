import { createEvent } from "./event.js";
import { addToRange } from "./range.js";
import { addDays } from "./dateutil.js";

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

// schema: { weekdays: [su, mo, tu, we, th, fr, sa], updatedTo: ..., repeatType: ..., relativeRange: ... }
export class WeeklyRepeat extends RepeatType {
    constructor() {
        super("weekly");
    }

    produceEvents(entry) {
        let start = new Date(entry.repeat.updatedTo);
        let weekdays = entry.repeat.weekdays;

        let events = [];

        for(let i = 0; i < 7; i++) {
            let newDate = new Date(addDays(start, i));
            if(weekdays[newDate.getDay()]) {
                let newRange = addToRange(entry.repeat.relativeRange, +newDate);
                events.push(createEvent(newRange, entry.id));
            }
        }
        let newDate = addDays(start, 7);
        entry.repeat.updatedTo = newDate;

        return events;
    }
}

// schema: { relativeRange: ..., day: ..., updatedTo: ..., repeatType: ... }
export class NoRepeats extends RepeatType {
    constructor() {
        super("none");
    }

    produceEvents(entry) {
        if(entry.repeat.updatedTo < entry.repeat.day + entry.repeat.relativeRange.end) {
            entry.repeat.updatedTo = entry.repeat.day;
            let range = addToRange(entry.repeat.relativeRange, entry.repeat.day);
            return [ createEvent(range, entry.id) ];
        }
        return [];
    }

    produceUntil(entry, end) {
        return this.produceEvents(entry).flat();
    }
}

export const repeatTypes = {
    weekly: new WeeklyRepeat(),
    none: new NoRepeats()
};

export function getRepeatType(entry) {
    return repeatTypes[entry.repeat.repeatType];
}

export function createRepeatData(repeatData) {
    return repeatData;
}