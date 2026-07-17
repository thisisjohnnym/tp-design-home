const CUSTOM_CURSOR_ATTR = "data-custom-cursor";

export function disableCustomCursor() {
  document.documentElement.setAttribute(CUSTOM_CURSOR_ATTR, "off");
}

export function enableCustomCursor() {
  document.documentElement.setAttribute(CUSTOM_CURSOR_ATTR, "on");
}
