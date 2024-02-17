class Timebar {
    constructor(element, parent) {
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
    }

    rerender(element) {
        this.render(element.getContext("2d"), element.width, element.height);
    }

    resize(element, width, height) {
        element.width = width;
        element.height = height;
        this.rerender(element);
    }

    render(context, width, height) {
        context.clearRect(0, 0, width, height);

        let gradient = context.createLinearGradient(0, 0, width, 0);
        for(let i = 0; i < TIMEBAR_GRADIENT.length; i++) {
            let position = i / (TIMEBAR_GRADIENT.length - 1);
            gradient.addColorStop(position, TIMEBAR_GRADIENT[i]);
        }

        context.beginPath();
        context.roundRect(0, 0, width, height, [20, 20, 0, 0]);
        context.clip();

        context.fillStyle = gradient;
        context.fillRect(0, 0, width, height);

        if(this.hovered) {
            context.fillStyle = "#00000055";
            context.fillRect(Math.floor(this.mouseX) - 2, 0, 4, Math.floor(height));
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