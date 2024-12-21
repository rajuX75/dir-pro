export class ThemeService {
  constructor() {
    this.theme = localStorage.getItem("theme") || this.getSystemTheme();
    this.init();
    this.initSystemThemeListener();
  }

  getSystemTheme() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  initSystemThemeListener() {
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (e) => {
        if (!localStorage.getItem("theme")) {
          this.theme = e.matches ? "dark" : "light";
          document.documentElement.setAttribute("data-theme", this.theme);
          this.updateToggleIcon();
        }
      });
  }

  init() {
    // Set initial theme
    document.documentElement.setAttribute("data-theme", this.theme);

    // Update toggle button icon
    this.updateToggleIcon();

    // Add event listener to toggle button
    document.getElementById("themeToggle").addEventListener("click", () => {
      this.toggleTheme();
    });
  }

  updateToggleIcon() {
    const toggleButton = document.getElementById("themeToggle");
    const icon = toggleButton.querySelector(".material-icons");
    icon.textContent = this.theme === "dark" ? "light_mode" : "dark_mode";
  }

  toggleTheme() {
    this.theme = this.theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", this.theme);
    localStorage.setItem("theme", this.theme);
    this.updateToggleIcon();
  }
}
