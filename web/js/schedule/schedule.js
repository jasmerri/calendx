import { getRepeatType } from "./repeat.js";
import { rangesIntersect } from "./range.js";
import { Day } from "./day.js";
import { justDay, rangeOfNDays } from "./dateutil.js";

export class Schedule {
    constructor() {
        this.currentEntryId = 0;
        this.entries = {};
        this.events = [];
    }

    registerEntry(entry) {
        entry.id = this.currentEntryId++;
        this.entries[entry.id] = entry;
        return entry.id;
    }

    generateUntil(time) {
        let newEvents = [];
        for(let key of Object.keys(this.entries)) {
            let entry = this.entries[key];
            newEvents.push(getRepeatType(entry).produceUntil(entry, time));
        }
        newEvents = newEvents.flat();
        newEvents.sort((a, b) => a.start - b.start);
        this.events = this.events.concat(newEvents);
    }

    getRelevantEvents(range) {
        // ensure enough events are generated
        this.generateUntil(range.end);

        let relevant = [];
        for(let event of this.events) {
            if(rangesIntersect(event.range, range)) {
                relevant.push(event);
            }
        }
        return relevant;
    }

    getDay(date) {
        let relevant = this.getRelevantEvents(rangeOfNDays(date, 1));
        return new Day(justDay(date), relevant);
    }

    static read(data) {
        try {
            if(data.version > 1) {
                throw new Error("database version too high");
            }

            let schedule = new Schedule();

            schedule.currentEntryId = data.schedule.currentEntryId;
            schedule.events = data.events;
            schedule.entries = data.entries;

            return schedule;
        } catch(e) {
            alert(`Failed to load data: ${e}`);
        }

        return undefined;
    }

    static write(schedule) {
        let data = {};
        data.schedule = {};

        data.version = 1;

        data.schedule.currentEntryId = schedule.currentEntryId;
        data.events = schedule.events;
        data.entries = schedule.entries;

        return data;
    }
}