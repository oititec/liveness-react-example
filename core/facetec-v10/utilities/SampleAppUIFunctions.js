export class SampleAppUIFunctions {
  constructor(elementString) {
    this.currentElements = document.querySelectorAll(elementString);
  }

  saveDisplayForElement(el) {
    const display = window.getComputedStyle(el).display;

    if (display && display !== "none") {
      el.setAttribute("displaytype", display);
    }
  }

  setDisplayForElement(el) {
    let display = "block";

    const saved = el.getAttribute("displaytype");
    if (saved !== null) {
      display = saved;
    }

    el.style.display = display;
  }

  _fadeIn(el, opacity = "1", duration = 300, callback) {
    if (!el) return;

    const computed = window.getComputedStyle(el);

    if (computed.display === "none" && computed.opacity === "1") {
      el.style.opacity = "0";
    }

    el.style.visibility = "visible";
    this.saveDisplayForElement(el);
    this.setDisplayForElement(el);

    el.style.transition = `opacity ${duration}ms`;

    setTimeout(() => {
      requestAnimationFrame(() => {
        el.style.opacity = opacity;
      });
    });

    setTimeout(() => {
      this.setDisplayForElement(el);
      if (callback) callback();
    }, duration);
  }

  _fadeOut(el, opacity = "0", duration = 300, callback) {
    if (!el) return;

    this.saveDisplayForElement(el);

    el.style.transition = `opacity ${duration}ms`;

    setTimeout(() => {
      requestAnimationFrame(() => {
        el.style.opacity = opacity;
      });
    });

    setTimeout(() => {
      el.style.display = "none";
      if (callback) callback();
    }, duration);
  }

  fadeOut(duration, callback) {
    this.currentElements.forEach((el) =>
      this._fadeOut(el, "0", duration, callback)
    );
  }

  fadeIn(duration, callback) {
    this.currentElements.forEach((el) =>
      this._fadeIn(el, "1", duration, callback)
    );
  }

  show() {
    this.currentElements.forEach((el) => {
      el.style.opacity = "1";
      this.setDisplayForElement(el);
    });
  }

  hide() {
    this.currentElements.forEach((el) => {
      el.style.opacity = "0";
      el.style.visibility = "visible";
      this.saveDisplayForElement(el);
      this.setDisplayForElement(el);
    });
  }

  scrollTop(value) {
    this.currentElements.forEach((el) => {
      el.scrollTop = value;
    });
  }

  css(styles) {
    if (typeof styles !== "object") {
      throw new Error("UI.css must be called with an object");
    }

    this.currentElements.forEach((el) => {
      Object.keys(styles).forEach((key) => {
        el.style[key] = styles[key];
      });
    });
  }
}