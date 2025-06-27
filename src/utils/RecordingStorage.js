/**
 * RecordingStorage - IndexedDB controller for managing audio recordings
 * Stores recordings with metadata: date, name, category, duration, size, filename
 */
class RecordingStorage {
  constructor() {
    this.dbName = 'AureaVoiceDB';
    this.dbVersion = 1;
    this.storeName = 'recordings';
    this.db = null;
  }

  /**
   * Initialize IndexedDB database
   */
  async initialize() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => {
        console.error('Failed to open IndexedDB:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('📦 IndexedDB initialized successfully');
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Create recordings object store
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { 
            keyPath: 'id',
            autoIncrement: true 
          });

          // Create indexes for efficient querying
          store.createIndex('filename', 'filename', { unique: true });
          store.createIndex('date', 'date', { unique: false });
          store.createIndex('category', 'category', { unique: false });
          store.createIndex('duration', 'duration', { unique: false });

          console.log('📦 IndexedDB object store created');
        }
      };
    });
  }

  /**
   * Generate UUID for recording filename
   */
  generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  /**
   * Generate recording filename with format "rec-8 uuid"
   */
  generateFilename() {
    const uuid = this.generateUUID();
    return `rec-8 ${uuid}`;
  }

  /**
   * Save recording to IndexedDB
   * @param {Blob} audioBlob - The audio file blob
   * @param {Object} metadata - Additional metadata
   */
  async saveRecording(audioBlob, metadata = {}) {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    try {
      const filename = this.generateFilename();
      const now = new Date();

      const recordingData = {
        filename: filename,
        date: now.toISOString(),
        name: metadata.name || 'Untitled Recording',
        category: metadata.category || 'speech-test',
        duration: metadata.duration || 0,
        size: audioBlob.size,
        audioBlob: audioBlob,
        sampleRate: metadata.sampleRate || 16000,
        format: metadata.format || 'wav',
        createdAt: now.getTime(),
        ...metadata
      };

      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const request = store.add(recordingData);

        request.onsuccess = () => {
          const recordingId = request.result;
          console.log(`📦 Recording saved with ID: ${recordingId}, filename: ${filename}`);
          resolve({
            id: recordingId,
            filename: filename,
            ...recordingData
          });
        };

        request.onerror = () => {
          console.error('Failed to save recording:', request.error);
          reject(request.error);
        };

        transaction.onerror = () => {
          console.error('Transaction failed:', transaction.error);
          reject(transaction.error);
        };
      });
    } catch (error) {
      console.error('Error saving recording:', error);
      throw error;
    }
  }

  /**
   * Get all recordings from IndexedDB
   */
  async getAllRecordings() {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.getAll();

      request.onsuccess = () => {
        const recordings = request.result.map(recording => ({
          ...recording,
          // Don't include the blob in the list for performance
          audioBlob: undefined,
          hasAudio: !!recording.audioBlob
        }));
        resolve(recordings);
      };

      request.onerror = () => {
        console.error('Failed to get recordings:', request.error);
        reject(request.error);
      };
    });
  }

  /**
   * Get recording by ID
   */
  async getRecording(id) {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get(id);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        console.error('Failed to get recording:', request.error);
        reject(request.error);
      };
    });
  }

  /**
   * Get recording by filename
   */
  async getRecordingByFilename(filename) {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const index = store.index('filename');
      const request = index.get(filename);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        console.error('Failed to get recording by filename:', request.error);
        reject(request.error);
      };
    });
  }

  /**
   * Delete recording by ID
   */
  async deleteRecording(id) {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(id);

      request.onsuccess = () => {
        console.log(`📦 Recording deleted: ${id}`);
        resolve(true);
      };

      request.onerror = () => {
        console.error('Failed to delete recording:', request.error);
        reject(request.error);
      };
    });
  }

  /**
   * Get recordings by category
   */
  async getRecordingsByCategory(category) {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const index = store.index('category');
      const request = index.getAll(category);

      request.onsuccess = () => {
        const recordings = request.result.map(recording => ({
          ...recording,
          audioBlob: undefined,
          hasAudio: !!recording.audioBlob
        }));
        resolve(recordings);
      };

      request.onerror = () => {
        console.error('Failed to get recordings by category:', request.error);
        reject(request.error);
      };
    });
  }

  /**
   * Get database statistics
   */
  async getStats() {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    try {
      const recordings = await this.getAllRecordings();
      const totalSize = recordings.reduce((sum, rec) => sum + (rec.size || 0), 0);
      const totalDuration = recordings.reduce((sum, rec) => sum + (rec.duration || 0), 0);

      return {
        totalRecordings: recordings.length,
        totalSize: totalSize,
        totalDuration: totalDuration,
        averageSize: recordings.length > 0 ? totalSize / recordings.length : 0,
        averageDuration: recordings.length > 0 ? totalDuration / recordings.length : 0
      };
    } catch (error) {
      console.error('Failed to get stats:', error);
      throw error;
    }
  }

  /**
   * Clear all recordings
   */
  async clearAllRecordings() {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.clear();

      request.onsuccess = () => {
        console.log('📦 All recordings cleared');
        resolve(true);
      };

      request.onerror = () => {
        console.error('Failed to clear recordings:', request.error);
        reject(request.error);
      };
    });
  }

  /**
   * Close database connection
   */
  close() {
    if (this.db) {
      this.db.close();
      this.db = null;
      console.log('📦 IndexedDB connection closed');
    }
  }
}

// Export singleton instance
export default new RecordingStorage();
