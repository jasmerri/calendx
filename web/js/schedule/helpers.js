import { createRepeatData } from "./repeat.js";
import { createEntry } from "./entry.js";

export function createWeeklyEntry(name, color, start, weekdays, relativeRange) {
    let repeatData = createRepeatData({
        updatedTo: start,
        repeatType: "weekly",
        weekdays,
        relativeRange
    });
    return createEntry(name, color, repeatData);
}