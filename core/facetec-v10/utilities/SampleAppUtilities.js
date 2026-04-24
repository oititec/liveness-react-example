import { Config } from "/core/facetec-v10/Config";
import { FaceTecSDK } from "../../10.0.42/core-sdk/FaceTecSDK.js/FaceTecSDK";
import { SampleAppUIFunctions } from "./SampleAppUIFunctions";
import { SoundFileUtilities } from "./SoundFileUtilities";

const VocalGuidanceMode = {
  MINIMAL: 0,
  FULL: 1,
  OFF: 2,
};

export class SampleAppUtilities {
  static vocalGuidanceSoundFilesDirectory =
    "core/facetec-v10/sample-app-resources/Vocal_Guidance_Audio_Files/";

  static vocalGuidanceOnPlayer = new Audio(
    this.vocalGuidanceSoundFilesDirectory + "vocal_guidance_on.mp3"
  );

  static vocalGuidanceOffPlayer = new Audio(
    this.vocalGuidanceSoundFilesDirectory + "vocal_guidance_off.mp3"
  );

  static vocalGuidanceMode = VocalGuidanceMode.MINIMAL;

  static setupAndFadeInMainUIOnInitializationSuccess() {
    this.setupVocalGuidancePlayers();
    this.fadeInMainUIContainer();
    this.enableControlButtons();

    if (this.isLikelyMobileDevice()) {
      this.fadeInVocalIconContainer();
    }
  }

  static setupVocalGuidancePlayers() {
    this.vocalGuidanceOnPlayer.volume = 0.4;
    this.vocalGuidanceOffPlayer.volume = 0.4;

    this.vocalGuidanceOnPlayer.onended = () =>
      this.enableVocalGuidanceButtons();

    this.vocalGuidanceOffPlayer.onended = () =>
      this.enableVocalGuidanceButtons();
  }

  static setVocalGuidanceMode() {
    this.disableVocalGuidanceButtons();

    if (
      !this.vocalGuidanceOnPlayer.paused ||
      !this.vocalGuidanceOffPlayer.paused
    ) {
      return;
    }

    let playPromise;

    switch (this.vocalGuidanceMode) {
      case VocalGuidanceMode.OFF:
        this.vocalGuidanceMode = VocalGuidanceMode.MINIMAL;
        toggleDisplay("vocal-guidance-icon-minimal", true);
        toggleDisplay("vocal-guidance-icon-full", false);
        toggleDisplay("vocal-guidance-icon-off", false);

        playPromise = this.vocalGuidanceOnPlayer.play();
        Config.currentCustomization.vocalGuidanceCustomization.mode =
          VocalGuidanceMode.MINIMAL;
        break;

      case VocalGuidanceMode.MINIMAL:
        this.vocalGuidanceMode = VocalGuidanceMode.FULL;
        toggleDisplay("vocal-guidance-icon-minimal", false);
        toggleDisplay("vocal-guidance-icon-full", true);
        toggleDisplay("vocal-guidance-icon-off", false);

        playPromise = this.vocalGuidanceOnPlayer.play();
        Config.currentCustomization.vocalGuidanceCustomization.mode =
          VocalGuidanceMode.FULL;
        break;

      case VocalGuidanceMode.FULL:
        this.vocalGuidanceMode = VocalGuidanceMode.OFF;
        toggleDisplay("vocal-guidance-icon-minimal", false);
        toggleDisplay("vocal-guidance-icon-full", false);
        toggleDisplay("vocal-guidance-icon-off", true);

        playPromise = this.vocalGuidanceOffPlayer.play();
        Config.currentCustomization.vocalGuidanceCustomization.mode =
          VocalGuidanceMode.OFF;
        break;
    }

    if (playPromise) {
      playPromise.catch(() => { });
    }

    FaceTecSDK.setCustomization(Config.currentCustomization);
  }

  static setVocalGuidanceSoundFiles() {
    const soundFileUtilities = new SoundFileUtilities();
    Config.currentCustomization =
      soundFileUtilities.setVocalGuidanceSoundFiles(
        Config.currentCustomization
      );

    FaceTecSDK.setCustomization(Config.currentCustomization);
  }

  static fadeInMainUIContainer() {
    new SampleAppUIFunctions("#theme-transition-overlay").fadeOut(800);
    new SampleAppUIFunctions(".wrapping-box-container").fadeIn(800);
    new SampleAppUIFunctions("footer").fadeIn(800);
  }

  static fadeInMainUIControls(callback) {
    if (SampleAppUtilities.isLikelyMobileDevice()) {
      new SampleAppUIFunctions("#custom-logo-container").fadeIn(800);
      new SampleAppUIFunctions("#vocal-icon-container").fadeIn(800);
    }

    new SampleAppUIFunctions("footer").fadeIn(800);

    new SampleAppUIFunctions("#controls").fadeIn(800, () => {
      SampleAppUtilities.enableVocalGuidanceButtons();

      if (typeof callback !== "undefined") {
        callback();
      }
    });
  }

  static fadeInVocalIconContainer() {
    new SampleAppUIFunctions("#vocal-icon-container").fadeIn(800);
  }

  static fadeOutMainUIAndPrepareForSession() {
    this.disableControlButtons();

    if (this.isLikelyMobileDevice()) {
      new SampleAppUIFunctions("#custom-logo-container").fadeOut(800);
      new SampleAppUIFunctions("#vocal-icon-container").fadeOut(800);
      this.disableVocalGuidanceButtons();
    }

    new SampleAppUIFunctions("footer").fadeOut(800);
    new SampleAppUIFunctions("#controls").fadeOut(800);
    new SampleAppUIFunctions(".wrapping-box-container").fadeOut(800);
    new SampleAppUIFunctions("#theme-transition-overlay").fadeIn(800);
  }

  static enableControlButtons() {
    document
      .querySelectorAll("#controls > button")
      .forEach((btn) => btn.removeAttribute("disabled"));

    this.enableVocalGuidanceButtons();
  }

  static disableControlButtons() {
    document
      .querySelectorAll("#controls > button")
      .forEach((btn) => btn.setAttribute("disabled", "true"));
  }

  static showMainUI() {
    this.fadeInMainUIContainer();
    this.fadeInMainUIControls();
  }

  static formatUIForDevice() {
    window.addEventListener("keydown", this.onKeyDown);
    this.displayElementsAfterStyling();
  }

  static displayElementsAfterStyling() {
    document.querySelectorAll("button").forEach((btn) => {
      btn.classList.add("button-transitions");
    });

    new SampleAppUIFunctions("body").fadeIn(800);
  }

  static onKeyDown(e) {
    if (e.key === "Tab") {
      this.enableKeyboardAccessibilityStyling(true);
    }
  }

  static enableKeyboardAccessibilityStyling(enable) {
    if (this.isLikelyMobileDevice()) return;

    document.querySelectorAll(".ft-button").forEach((el) => {
      el.style.outline = enable ? "revert" : "none";
    });
  }

  static isLikelyMobileDevice() {
    let isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(
      navigator.userAgent || ""
    );

    if (
      isMobile &&
      (navigator.userAgent.includes("CrOS") ||
        navigator.userAgent.includes("Chromebook"))
    ) {
      isMobile = false;
    }

    return screen.width < screen.height || isMobile;
  }

  static disableVocalGuidanceButtons() {
    document
      .querySelectorAll(".vocal-icon")
      .forEach((btn) => btn.setAttribute("disabled", "true"));
  }

  static enableVocalGuidanceButtons() {
    document
      .querySelectorAll(".vocal-icon")
      .forEach((btn) => btn.removeAttribute("disabled"));
  }
}

// helper
function toggleDisplay(id, show) {
  const el = document.getElementById(id);
  if (el) el.style.display = show ? "block" : "none";
}