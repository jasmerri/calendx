export class Day {
    constructor(date, events) {
        // date: 0:00 on the day
        this.date = date;
        this.events = events ?? [];
    }
}