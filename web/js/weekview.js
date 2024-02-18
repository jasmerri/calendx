export class WeekView {
    constructor(schedule, timebar) {
        this.schedule = schedule;
        this.timebar = timebar;
        this.day = undefined;
    }

    setDay(day) {
        let d = this.schedule.getDay(day);
        this.day = d;
        this.timebar.setDay(d);
    }

    reload() {
        this.setDay(this.schedule.getDay(this.day.date));
    }
}