"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyTheme = exports.getStoredTheme = void 0;
function getStoredTheme() {
    if (typeof window === "undefined")
        return "system";
    var stored = localStorage.getItem("theme");
    return stored === "light" || stored === "dark" ? stored : "system";
}
exports.getStoredTheme = getStoredTheme;
function applyTheme(theme) {
    if (typeof document === "undefined")
        return;
    var resolved = theme === "system"
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light"
        : theme;
    document.documentElement.setAttribute("data-theme", resolved);
    localStorage.setItem("theme", theme);
}
exports.applyTheme = applyTheme;
