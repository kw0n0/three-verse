export default class ColorPickerManager {
    #carController;

    constructor(carController) {
        this.#carController = carController;
        this.#initializeColorPicker();
    }

    #initializeColorPicker() {
        const colorPicker = document.getElementById('customColor');
        
        colorPicker.addEventListener('input', (e) => {
            this.#carController.changeColor(e.target.value);
        });
    }
}