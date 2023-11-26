import {ArgonComponent} from "../component.js";
import {localize} from "../../hud.js";
import {ButtonPanelButton} from "./buttons/buttonPanelButton.js";
import {SplitButton} from "./buttons/splitButton.js";

export class ActionPanel extends ArgonComponent{

  get classes() {
    return ["actions-container"]
  }

  get label() {
    return "Action Panel";
  }

  updateVisibility() {
    if (!this._buttons) return;
    let count = this._buttons.length;
    for (const button of this._buttons) {
      if (button.visible === false) count--;
    }
    this.element.classList.toggle("hidden", count === 0);
  }

  updateItem(item) {
    if (!this._buttons) return;
    for (const button of this._buttons) {
      if (button.item === item) button.render();
      if (button instanceof ButtonPanelButton) button.updateItem(item);
      if (button instanceof SplitButton) {
        if (button.button1.item === item) button.button1.render();
        if (button.button2.item === item) button.button2.render();
      }
    }
  }

  async _getButtons() {
    console.warn("ActionPanel._getButtons() is not implemented");
    return [];
  }

  async _renderInner() {
    await super._renderInner();
    this.element.dataset.title = localize(this.label);
    const buttons = await this._getButtons();
    this._buttons = buttons;
    for (const button of buttons) {
      this.element.appendChild(button.element);
      button.render();
    }
  }
}