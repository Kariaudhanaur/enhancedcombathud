export class TargetPicker{
  constructor ({token, targets, ranges}) {
    this.ranges = ranges;
    this.token = token;
    this.resolve = null;
    this.reject = null;
    this._targetCount = game.user.targets.size;
    this._maxTargets = targets;

    const targetTool = document.querySelector('.control-tool[data-tool="target"]')
    targetTool?.click();

    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
    this.targetHook = Hooks.on("targetToken", (user, token, targeted) => { 
      this.checkComplete();
    });

    this.movelistener = (event) => {
        this.update(event);
    };
    this.clicklistener = (event) => { 
      if(event.which === 3) {
        this.end(false);
      }
    };
    this.keyuplistener = (event) => { 
      //check for + and - keys
      if (event.key === "+" || event.key === "=") {
        this.maxTargets++;
      }
      if (event.key === "-" || event.key === "_") {
        if (this.maxTargets > 1) this.maxTargets--;
      }
    };
    document.addEventListener("mousemove", this.movelistener);
    document.addEventListener("mouseup", this.clicklistener);
    document.addEventListener("keyup", this.keyuplistener);
    this.init();
  }

  checkComplete() { 
      this.targetCount = game.user.targets.size;
      if (this.targetCount >= this.maxTargets) {
          this.end(true);
      }
  }

  set targetCount(count) { 
    this._targetCount = count;
    this.update();
  }

  get targetCount() {
    return this._targetCount;
  }

  set maxTargets(count) {
    this._maxTargets = count;
    this.update();
    this.checkComplete();
  }

  get maxTargets() {
    return this._maxTargets;
  }

  init() { 
    const element = document.createElement("div");
    element.classList.add("ech-target-picker");
    document.body.appendChild(element);
    this.element = element;
    if (!this.maxTargets || this.targetCount == this.maxTargets) return this.end(true);
    canvas.hud.enhancedcombathud.showRangeRings(this.ranges.normal, this.ranges.long);
  }

  update(event) {
    if (event) {
      const clientX = event.clientX;
      const clientY = event.clientY;
      this.element.style.left = clientX + 20 + "px";
      this.element.style.top = clientY + "px";
    }
    this.element.innerText = `${this.targetCount}/${this.maxTargets} Targets`;
  }

  end(res) {
    document.querySelector(".control-tool").click();
    this.resolve(res);
    canvas.hud.enhancedcombathud.clearRanges(true);
    this.element.remove();
    Hooks.off("targetToken", this.targetHook);
    document.removeEventListener("mousemove", this.movelistener);
    document.removeEventListener("mouseup", this.clicklistener);
    document.removeEventListener("keyup", this.keyuplistener);
    document.querySelector('.control-tool[data-tool="select"]')?.click();
  }
}