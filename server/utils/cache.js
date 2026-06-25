class Cache {
  constructor() {
    this.cache = new Map();
  }

  /**
   * Get an item from the cache.
   * @param {string} key 
   * @returns {any|null} The cached value or null if expired/not found
   */
  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  /**
   * Set an item in the cache.
   * @param {string} key 
   * @param {any} value 
   * @param {number} ttlSeconds Time to live in seconds
   */
  set(key, value, ttlSeconds) {
    const expiry = Date.now() + (ttlSeconds * 1000);
    this.cache.set(key, { value, expiry });
  }

  /**
   * Clear the entire cache
   */
  clear() {
    this.cache.clear();
  }
}

// Export a singleton instance
const globalCache = new Cache();
export default globalCache;
