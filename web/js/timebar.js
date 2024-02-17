class Timebar {
    constructor(element, parent) {
        let context = element.getContext("2d");
        this.observer = new ResizeObserver(entries => {
            let elem = entries[0];
            this.resize(element, );
        });
        this.observer.observe(parent);
    }

    resize(element, width, height) {

    }

    render(context, width, height) {
        context.fillRect(0, 0, width, height);
    }
}