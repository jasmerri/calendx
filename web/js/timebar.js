import { addDays, timeStr } from "./schedule/dateutil.js";
import { rangesIntersect } from "./schedule/range.js";

const EVENTBAR_HEIGHT = 20;
const TIMEBAR_HEIGHT = 100;

export class Timebar {
    constructor(element, parent, schedule) {
        this.observer = new ResizeObserver(entries => {
            let elem = entries[0];
            if(elem.contentBoxSize) {
                let size = elem.contentBoxSize[0] ?? elem.contentBoxSize;
                let width = size.inlineSize;
                let height = size.blockSize;
                this.resize(element, width, height);
            }
        });
        this.observer.observe(parent);

        this.mouseX = -1;
        this.mouseY = -1;
        this.hovered = false;

        element.addEventListener("mousemove", event => {
            let rect = element.getBoundingClientRect();
            this.mouseX = event.clientX - rect.left;
            this.mouseY = event.clientY - rect.top;
            this.rerender(element);
        });

        element.addEventListener("mouseleave", () => {
            this.hovered = false;
            this.rerender(element);
        });

        element.addEventListener("mouseenter", () => {
            this.hovered = true;
            this.rerender(element);
        });

        this.day = undefined;
        this.schedule = schedule;
    }

    setDay(day) {
        this.day = day;
    }

    rerender(element) {
        this.render(element.getContext("2d"), element.width, element.height);
    }

    resize(element, width, height) {
        element.width = width;
        element.height = height;
        this.rerender(element);
    }

    renderGradient(context, width, height) {
        let gradient = context.createLinearGradient(0, 0, width, 0);
        for(let i = 0; i < TIMEBAR_GRADIENT.length; i++) {
            let position = i / (TIMEBAR_GRADIENT.length - 1);
            gradient.addColorStop(position, TIMEBAR_GRADIENT[i]);
        }

        context.fillStyle = gradient;
        context.fillRect(0, 0, width, height);
    }

    renderLine(context, width, height) {
        if(this.hovered) {
            context.fillStyle = "#00000055";
            context.fillRect(Math.floor(this.mouseX) - 2, 0, 4, Math.floor(height));
        }
    }

    computeGraphicalPosition(event, width) {
        let start = this.day.date;
        let end = addDays(start, 1);
        let length = end - start;

        let left = (Math.max(start, event.range.start) - start) / length * width;
        let right = (Math.min(end, event.range.end) - start) / length * width;

        return { start: left, end: right, width: right - left };
    }

    renderEvents(context, width, height) {
        context.fillStyle = "white";
        context.fillRect(0, height - EVENTBAR_HEIGHT, width, EVENTBAR_HEIGHT);
        for(let event of this.day.events) {
            let position = this.computeGraphicalPosition(event, width);
            let entry = this.schedule.entries[event.entryId];
            context.fillStyle = `${entry.color}77`;
            context.fillRect(Math.floor(position.start), height - EVENTBAR_HEIGHT, Math.floor(position.width), height);
        }
    }

    renderTicks(context, width, height) {
        let increment = width / 48;
        context.fillStyle = "#22222233";
        for(let i = 0; i < 48; i++) {
            let tickHeight = (i % 2 < 1) ? height : EVENTBAR_HEIGHT * 2;
            context.fillRect(Math.floor(increment * i), (height - tickHeight), 1, tickHeight);
        }
    }

    renderTimebar(context, width, height) {
        context.clearRect(0, 0, width, height);

        context.save();

        context.beginPath();
        context.roundRect(0, 0, width, height, [20, 20, 0, 0]);
        context.clip();

        this.renderGradient(context, width, height - EVENTBAR_HEIGHT);

        if(this.day != undefined) {
            this.renderEvents(context, width, height);
        }

        this.renderTicks(context, width, height);
        this.renderLine(context, width, height);

        context.restore();
    }

    renderTooltip(context, event, entry, x, y) {
        let margin = 15;
        let offset = 10;

        let lines = [];
        let measurements = [];

        lines.push(entry.name);
        lines.push(`${timeStr(event.range.start)}-${timeStr(event.range.end)}`);

        context.font = "24px serif";

        for(let i = 0; i < lines.length; i++) {
            measurements.push(context.measureText(lines[i]));
        }

        let maxWidth = 0;
        let totalHeight = 0;
        for(let i = 0; i < measurements.length; i++) {
            let metrics = measurements[i];
            maxWidth = Math.max(metrics.width);
            totalHeight += metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent;
        }

        let actualWidth = Math.floor(maxWidth + margin * 2);
        let actualHeight = Math.floor(totalHeight + margin * 2);

        let posx = Math.floor(x + offset);
        let posy = Math.floor(y + offset);

        context.fillStyle = "#222222bb";
        context.fillRect(posx, posy, actualWidth, actualHeight);

        let hpos = margin;
        context.fillStyle = "white";
        for(let i = 0; i < lines.length; i++) {
            let metrics = measurements[i];
            context.fillText(lines[i], Math.floor(posx + (actualWidth - metrics.width) / 2), Math.floor(posy + hpos + metrics.fontBoundingBoxAscent));
            hpos += metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent;
        }
    }

    renderEventStack(context, width, height, x, y) {
        context.translate(x, y);

        let events = [...this.day.events];
        events.sort((a, b) => a.range.start - b.range.start);

        let layers = [ [], [], [], [] ];
        for(let event of events) {
            let i = 0;
            outer:
            while(true) {
                let layer = layers[i] ?? (layers[i] = []);
                for(let other of layer) {
                    if(rangesIntersect(other.range, event.range)) {
                        i++;
                        continue outer;
                    }
                }
                break;
            }
            layers[i].push(event);
        }

        context.fillStyle = "#eeeeff";
        context.fillRect(0, 0, width, height);

        let barHeight = Math.floor(height / layers.length);

        let tooltip = undefined;

        for(let i = 0; i < layers.length; i++) {
            let layer = layers[i];
            for(let event of layer) {
                let position = this.computeGraphicalPosition(event, width);
                let entry = this.schedule.entries[event.entryId];

                let top = barHeight * i;
                let bottom = top + barHeight;

                context.fillStyle = `${entry.color}cc`;
                context.fillRect(Math.floor(position.start), top, Math.floor(position.width), barHeight);

                let mx = this.mouseX - x;
                let my = this.mouseY - y;
                if(mx > position.start && mx < position.end && my > top && my < bottom) {
                    tooltip = [context, event, entry, mx, my];
                }
            }
        }

        if(tooltip != undefined) {
            this.renderTooltip(...tooltip);
        }
    }

    render(context, width, height) {
        this.renderTimebar(context, width, TIMEBAR_HEIGHT);

        context.fillStyle = "black";
        context.fillRect(0, TIMEBAR_HEIGHT - 1, width, 1);

        context.save();
        if(this.day != undefined) {
            this.renderEventStack(context, width, height - TIMEBAR_HEIGHT, 0, TIMEBAR_HEIGHT);
        }
        context.restore();
    }
}

const TIMEBAR_GRADIENT = (() => {
    let colors = [
        "#3D47D9",
        "#6855D2",
        "#BE6FC3",
        "#F1B2BB",
        "#F5CDBB",
        "#F9E7BB"
    ];
    return colors.concat([...colors].reverse());
})();