export class Editor {
    constructor() {
        this.entry = undefined;
        this.initialize();
    }

    anyChecked() {
        let checked = false;
        for(let day of this.daysOfTheWeek) {
            if(day.checked) {
                checked = true;
                break;
            }
        }

        return checked;
    }

    trySubmit() {
        if(this.entry == undefined || this.name.value == "" || (!this.anyChecked() && this.date.value == "") || this.begins.value == "" || this.ends.value == "") {
            return;
        }
        this.closeEditor();
    }

    clearEditor() {
        this.color.value = "";
        this.name.value = "";
        this.date.value = "";
        this.begins.value = "";
        this.ends.value = "";
        
        for(let day of this.daysOfTheWeek) {
            day.checked = false;
        }
    }

    openEditor(entry) {
        this.entry = entry;
        this.clearEditor();
        this.me.classList.remove("invisible");
    }

    closeEditor() {
        this.entry = undefined;
        this.me.classList.add("invisible");
    }

    initialize() {
        let $ = document.querySelector.bind(document);

        this.me = $("#edit-menu");
        this.daysOfTheWeek = [
            $("#edit-sunday"),
            $("#edit-monday"),
            $("#edit-tuesday"),
            $("#edit-wednesday"),
            $("#edit-thursday"),
            $("#edit-friday"),
            $("#edit-saturday"),
        ];

        this.color = $("#edit-color");
        this.name = $("#edit-name");
        this.date = $("#edit-date");
        this.begins = $("#edit-begins");
        this.ends = $("#edit-ends");
        this.save = $("#edit-save");

        for(let day of this.daysOfTheWeek) {
            day.addEventListener("input", () => {
                this.date.disabled = this.anyChecked();
            })
        }

        this.save.addEventListener("click", () => this.trySubmit());
    }
}