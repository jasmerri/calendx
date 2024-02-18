import { addDays } from "./schedule/dateutil.js";

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

    renderEvents(context, width, height) {
        let start = this.day.date;
        let end = addDays(start, 1);
        let length = end - start;

        for(let event of this.day.events) {
            let left = (Math.max(start, event.range.start) - start) / length * width;
            let right = (Math.min(end, event.range.end) - start) / length * width;
            let entry = this.schedule.entries[event.entryId];
            context.fillStyle = `${entry.color}77`;
            context.fillRect(Math.floor(left), 0, Math.floor(right - left), height);
        }
    }

    render(context, width, height) {
        context.clearRect(0, 0, width, height);

        context.beginPath();
        context.roundRect(0, 0, width, height, [20, 20, 0, 0]);
        context.clip();

        this.renderGradient(context, width, height);
        this.renderLine(context, width, height);

        if(this.day != undefined) {
            this.renderEvents(context, width, height);
        }

        context.globalCompositeOperation = false;
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