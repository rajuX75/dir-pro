import { SearchService } from "./modules/search.js";
import { HistoryService } from "./modules/history.js";
import { UIService } from "./modules/ui.js";
import { ThemeService } from "./modules/theme.js";

class App {
  constructor() {
    if (!this.checkBrowserSupport()) {
      this.showFallbackInterface();
      return;
    }
    this.searchService = new SearchService();
    this.historyService = new HistoryService();
    this.uiService = new UIService(this.historyService);
    this.themeService = new ThemeService();

    this.initializeApp();
  }

  checkBrowserSupport() {
    return (
      "localStorage" in window &&
      "Promise" in window &&
      "querySelector" in document
    );
  }

  initializeApp() {
    // Make app instance globally available for HTML event handlers
    window.app = this;
  }

  async handleSearch(event) {
    event.preventDefault();

    try {
      this.uiService.setLoading(true);
      const searchParams = this.uiService.getFormData();
      this.searchService.setSearchParams(searchParams);

      const searchData = this.searchService.performSearch();
      this.historyService.saveHistory(searchData);
      this.uiService.updateHistoryDisplay();
    } catch (error) {
      this.uiService.showError("Search failed. Please try again.");
    } finally {
      this.uiService.setLoading(false);
    }
  }

  toggleAdvancedOptions() {
    this.uiService.toggleAdvancedOptions();
  }

  clearHistory() {
    if (confirm("Are you sure you want to clear your search history?")) {
      this.historyService.clearHistory();
      this.uiService.updateHistoryDisplay();
    }
  }

  restoreSearch(searchData) {
    this.uiService.restoreSearch(searchData);
  }
}

// Initialize the application
new App();
