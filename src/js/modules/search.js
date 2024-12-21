export class SearchService {
  constructor() {
    this.searchParams = {
      query: "",
      fileType: "any",
      searchLocation: "",
      exactMatch: false,
      excludeDownloadSites: false,
    };
  }

  buildSearchQuery() {
    let searchQuery = this.searchParams.query;

    if (this.searchParams.exactMatch) {
      searchQuery = `"${searchQuery}"`;
    }

    if (this.searchParams.fileType !== "any") {
      searchQuery += ` (filetype:${this.searchParams.fileType})`;
    }

    if (this.searchParams.searchLocation) {
      searchQuery += ` ${this.searchParams.searchLocation}`;
    }

    if (this.searchParams.excludeDownloadSites) {
      searchQuery +=
        " -site:rapidgator.net -site:uploaded.net -site:mediafire.com -site:4shared.com";
    }

    searchQuery +=
      ' (intitle:index.of OR inurl:index.of OR intext:"parent directory")';

    return `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
  }

  setSearchParams(params) {
    if (!params.query.trim()) {
      throw new Error("Please enter a search query");
    }

    // Sanitize input
    const sanitizedParams = {
      query: this.sanitizeInput(params.query),
      fileType: this.validateFileType(params.fileType),
      searchLocation: this.validateSearchLocation(params.searchLocation),
      exactMatch: Boolean(params.exactMatch),
      excludeDownloadSites: Boolean(params.excludeDownloadSites),
    };

    this.searchParams = { ...this.searchParams, ...sanitizedParams };
  }

  sanitizeInput(input) {
    return input.replace(/[<>]/g, "").trim();
  }

  validateFileType(fileType) {
    const validTypes = ["any", "pdf", "doc|docx" /* ... */];
    return validTypes.includes(fileType) ? fileType : "any";
  }

  validateSearchLocation(location) {
    // Basic sanitization for search location
    return location ? location.replace(/[<>]/g, "").trim() : "";
  }

  performSearch() {
    try {
      const searchUrl = this.buildSearchQuery();
      window.open(searchUrl, "_blank");
      return this.searchParams;
    } catch (error) {
      console.error("Search failed:", error);
      // Could add UI notification here
      throw error;
    }
  }
}
