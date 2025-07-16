class IndexedDBHelper {
  constructor() {
    this.dbName = 'ai-genx-db';
    this.version = 1;
    this.storeName = 'resume-files';
    this.db = null;
  }

  // Initialize the database
  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Create object store if it doesn't exist
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: 'id' });
          store.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }

  // Save file to IndexedDB
  async saveFile(file, id = 'current-resume') {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      
      const fileData = {
        id: id,
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: file.lastModified,
        data: file, // Store the actual file object
        timestamp: new Date().toISOString()
      };
      
      const request = store.put(fileData);
      
      request.onsuccess = () => resolve(fileData);
      request.onerror = () => reject(request.error);
    });
  }

  // Get file from IndexedDB
  async getFile(id = 'current-resume') {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get(id);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Delete file from IndexedDB
  async deleteFile(id = 'current-resume') {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(id);
      
      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }

  // Save resume summary separately
  async saveResumeText(text, id = 'current-resume-text') {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      
      const textData = {
        id: id,
        text: text,
        timestamp: new Date().toISOString()
      };
      
      const request = store.put(textData);
      
      request.onsuccess = () => resolve(textData);
      request.onerror = () => reject(request.error);
    });
  }

  // Get resume text
  async getResumeText(id = 'current-resume-text') {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get(id);
      
      request.onsuccess = () => resolve(request.result?.text || '');
      request.onerror = () => reject(request.error);
    });
  }

  // List all files
  async getAllFiles() {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Clear all data
  async clearAll() {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.clear();
      
      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }
}

// Export singleton instance
export const indexedDBHelper = new IndexedDBHelper();