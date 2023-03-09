// UI Convenience Functions
export const UI = function (elementString) {
  // Get the element(s) for ui operations from the elementString;
  const currentElements = document.querySelectorAll(elementString);

  // Save the original display property of the element before hiding it
  const saveDisplayForElement = function (el) {
    const display = window.getComputedStyle(el).display;
    if (display && display !== 'none') {
      el.setAttribute('display', display);
    }
  };

  // Set the display of the element to either block or restore it's original value
  const setDisplayForElement = function (el) {
    let display = 'block';
    if (el.getAttribute('display')) {
      display = el.getAttribute('display');
    }
    el.style.display = display;
  };

  // Fade in the element to opacity over duration ms with an optional callback
  const fadeIn = function (el, opacity, duration, callback) {
    if (!el) {
      return;
    }
    opacity = opacity || 1;
    duration = duration || 1;
    const computedStyle = window.getComputedStyle(el);
    if (computedStyle.display === 'none' && computedStyle.opacity === '1') {
      el.style.opacity = '0';
    }
    saveDisplayForElement(el);
    setDisplayForElement(el);
    el.style['-webkit-transition'] = 'opacity ' + duration + 'ms';
    el.style['-moz-transition'] = 'opacity ' + duration + 'ms';
    el.style['-o-transition'] = 'opacity ' + duration + 'ms';
    el.style.transition = 'opacity ' + duration + 'ms';
    // Allow JS to clear execution stack
    window.setTimeout(function () {
      requestAnimationFrame(function () {
        el.style.opacity = opacity;
      });
    });
    if (callback) {
      window.setTimeout(function () {
        callback();
      }, duration);
    }
  };

  // Fade out the element to opacity over duration ms with an optional callback
  const fadeOut = function (el, opacity, duration, callback) {
    if (!el) {
      return;
    }
    saveDisplayForElement(el);
    opacity = opacity || 0;
    duration = duration || 1;
    el.style['-webkit-transition'] = 'opacity ' + duration + 'ms';
    el.style['-moz-transition'] = 'opacity ' + duration + 'ms';
    el.style['-o-transition'] = 'opacity ' + duration + 'ms';
    el.style.transition = 'opacity ' + duration + 'ms';
    // Allow JS to clear execution stack
    window.setTimeout(function () {
      requestAnimationFrame(function () {
        el.style.opacity = opacity;
      });
    });
    if (opacity === 0) {
      window.setTimeout(function () {
        el.style.display = 'none';
      }, duration);
    }
    if (callback) {
      window.setTimeout(function () {
        callback();
      }, duration);
    }
  };

  return {
    fadeOut(duration, callback) {
      currentElements.forEach(function (element) {
        fadeOut(element, 0, duration, callback);
      });
    },
    fadeIn(duration, callback) {
      currentElements.forEach(function (element) {
        fadeIn(element, 1, duration, callback);
      });
    },
    show() {
      currentElements.forEach(function (element) {
        element.style.opacity = '1';
        setDisplayForElement(element);
      });
    },
    hide() {
      currentElements.forEach(function (element) {
        element.style.opacity = '0';
        setDisplayForElement(element);
      });
    },
    scrollTop(value) {
      currentElements.forEach(function (element) {
        element.scrollTop = value;
      });
    },
    css(styleProperTies) {
      if (typeof styleProperTies !== 'object') {
        throw new Error('UI.css must be called with an object');
        return;
      }
      currentElements.forEach(function (element) {
        Object.keys(styleProperTies).map(function (style) {
          // @ts-ignore
          element.style[style] = styleProperTies[style];
        });
      });
    },
  };
};
