class Config {
    constructor() {
      this.baseUrl = 'https://localhost:7069/api'; // Base URL for all API calls
    }
  
    getBaseUrl() {
      return this.baseUrl;
    }
  }
  
  export default new Config();