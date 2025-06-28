class RecordingStorage {
  constructor() {
    this.dbName = 'AureaVoiceDB';
    this.dbVersion = 1;
    this.storeName = 'recordings';
    this.db = null;
  }

  async initialize() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => {
        console.error('Failed to open IndexedDB:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, {
            keyPath: 'id',
            autoIncrement: true
          });

          store.createIndex('filename', 'filename', { unique: true });
          store.createIndex('date', 'date', { unique: false });
          store.createIndex('category', 'category', { unique: false });
          store.createIndex('duration', 'duration', { unique: false });
        }
      };
    });
  }

  generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  generateFilename() {
    const uuid = this.generateUUID();
    return `rec-8 ${uuid}`;
  }
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

  async deleteRecording(id) {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(id);

      request.onsuccess = () => {
        resolve(true);
      };

      request.onerror = () => {
        console.error('Failed to delete recording:', request.error);
        reject(request.error);
      };
    });
  }

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

  async clearAllRecordings() {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.clear();

      request.onsuccess = () => {
        resolve(true);
      };

      request.onerror = () => {
        console.error('Failed to clear recordings:', request.error);
        reject(request.error);
      };
    });
  }

  close() {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }
}

export default new RecordingStorage();
