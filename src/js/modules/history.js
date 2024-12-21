export class HistoryService {
  constructor() {
    this.HISTORY_KEY = "searchHistory";
    this.MAX_HISTORY_ITEMS = 10;
    this.searchHistory = this.loadHistory();
  }

  loadHistory() {
    return JSON.parse(localStorage.getItem(this.HISTORY_KEY) || "[]");
  }

  saveHistory(searchData) {
    this.searchHistory.unshift({
      ...searchData,
      timestamp: new Date().toISOString(),
    });

    this.searchHistory = this.searchHistory.slice(0, this.MAX_HISTORY_ITEMS);
    localStorage.setItem(this.HISTORY_KEY, JSON.stringify(this.searchHistory));
    return this.searchHistory;
  }

  clearHistory() {
    this.searchHistory = [];
    localStorage.removeItem(this.HISTORY_KEY);
    return this.searchHistory;
  }

  getHistory() {
    return this.searchHistory;
  }
}
