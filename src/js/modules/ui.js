import { debounce } from "./utils.js";

export class UIService {
  constructor(historyService) {
    this.historyService = historyService;
    this.initializeEventListeners();
  }

  initializeEventListeners() {
    document.querySelector(".advanced-options").style.display = "grid";
    document.querySelector(".advanced-options").style.gap = "2rem";

    document.getElementById("searchForm").addEventListener("submit", (e) => {
      e.preventDefault();
      window.app.handleSearch(e);
    });

    document.addEventListener("DOMContentLoaded", () => {
      this.updateHistoryDisplay();
    });
  }

  toggleAdvancedOptions() {
    const advancedOptions = document.querySelector(".advanced-options");
    advancedOptions.classList.toggle("show");
  }

  getFormData() {
    return {
      query: document.getElementById("searchQuery").value,
      fileType: document.getElementById("fileType").value,
      searchLocation: document.getElementById("searchLocation").value,
      exactMatch: document.getElementById("exactMatch").checked,
      excludeDownloadSites: document.getElementById("excludeDownloadSites")
        .checked,
    };
  }

  updateHistoryDisplay = debounce(() => {
    const historyContainer = document.getElementById("searchHistory");
    const history = this.historyService.getHistory();

    historyContainer.innerHTML = history.length
      ? this.generateHistoryHTML(history)
      : "";
  }, 250);

  generateHistoryHTML(history) {
    const historyTitle = `
            <h3 style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem">
                <span class="material-icons">history</span> Recent Searches
            </h3>
        `;

    const historyItems = history
      .map((item) => this.generateHistoryItemHTML(item))
      .join("");

    return historyTitle + historyItems;
  }

  generateHistoryItemHTML(item) {
    const timestamp = new Date(item.timestamp).toLocaleString();
    return `
            <div class="history-item" onclick="window.app.restoreSearch(${JSON.stringify(
              item
            ).replace(/"/g, "&quot;")})">
                <div style="display: flex; justify-content: space-between; align-items: center">
                    <div>
                        <strong>${item.query}</strong>
                        ${
                          item.fileType !== "any"
                            ? `<span class="badge">${item.fileType}</span>`
                            : ""
                        }
                    </div>
                    <small>${timestamp}</small>
                </div>
            </div>
        `;
  }

  restoreSearch(searchData) {
    document.getElementById("searchQuery").value = searchData.query;
    document.getElementById("fileType").value = searchData.fileType;
    document.getElementById("searchLocation").value = searchData.searchLocation;
    document.getElementById("exactMatch").checked = searchData.exactMatch;
    document.getElementById("excludeDownloadSites").checked =
      searchData.excludeDownloadSites;
  }

  setLoading(isLoading) {
    const searchButton = document.querySelector('button[type="submit"]');
    if (isLoading) {
      searchButton.disabled = true;
      searchButton.innerHTML =
        '<span class="material-icons">hourglass_empty</span> Searching...';
    } else {
      searchButton.disabled = false;
      searchButton.innerHTML =
        '<span class="material-icons">search</span> Search';
    }
  }

  showError(message) {
    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.textContent = message;

    const searchBox = document.querySelector(".search-box");
    searchBox.appendChild(errorDiv);

    // Remove error after 3 seconds
    setTimeout(() => {
      errorDiv.remove();
    }, 3000);
  }
}
