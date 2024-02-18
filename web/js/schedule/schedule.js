import { rangesIntersect } from "./range.js";

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

    static read(data) {
        try {
            let schedule = new Schedule();

            scheudle.currentEntryId = data.schedule.currentEntryId;
            return schedule;
        } catch(e) {
            alert("Failed to load data!");
        }

        throw new Error("schedule read is not yet implemented");

        return undefined;
    }

    static write() {
        let data = {};
        data.schedule = {};
        data.schedule.currentEntryId = this.currentEntryId;

        throw new Error("schedule write is not yet implemented");

        return data;
    }
}