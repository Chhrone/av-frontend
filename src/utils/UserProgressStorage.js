/**
 * Storage untuk menyimpan progress latihan pengguna di IndexedDB
 */
class UserProgressStorage {
  constructor() {
    this.dbName = 'AureaVoiceDB';
    this.version = 2; // Increment version untuk update schema
    this.storeName = 'userProgress';
    this.db = null;
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => {
        console.error('Failed to open IndexedDB:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('UserProgressStorage initialized successfully');
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Hapus store lama jika ada
        if (db.objectStoreNames.contains(this.storeName)) {
          db.deleteObjectStore(this.storeName);
        }

        // Buat store baru
        const store = db.createObjectStore(this.storeName, { keyPath: 'uuid' });
        
        // Buat index untuk pencarian
        store.createIndex('exerciseId', 'exerciseId', { unique: false });
        store.createIndex('date', 'date', { unique: false });
        store.createIndex('confidenceScore', 'confidenceScore', { unique: false });
        store.createIndex('createdAt', 'createdAt', { unique: false });
        
        console.log('UserProgress object store created with indexes');
      };
    });
  }

  async saveProgress(progressData) {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    const progress = {
      uuid: progressData.uuid || this.generateUUID(),
      exerciseId: progressData.exerciseId,
      duration: progressData.duration,
      date: progressData.date || new Date(),
      confidenceScore: progressData.confidenceScore,
      metadata: progressData.metadata || {},
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.put(progress);

      request.onsuccess = () => {
        console.log('Progress saved successfully:', progress.uuid);
        resolve(progress);
      };

      request.onerror = () => {
        console.error('Failed to save progress:', request.error);
        reject(request.error);
      };
    });
  }

  async getAllProgress() {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.getAll();

      request.onsuccess = () => {
        const progressList = request.result.sort((a, b) => new Date(b.date) - new Date(a.date));
        resolve(progressList);
      };

      request.onerror = () => {
        console.error('Failed to get all progress:', request.error);
        reject(request.error);
      };
    });
  }

  async getProgressByUUID(uuid) {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get(uuid);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        console.error('Failed to get progress by UUID:', request.error);
        reject(request.error);
      };
    });
  }

  async getProgressByExerciseId(exerciseId) {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const index = store.index('exerciseId');
      const request = index.getAll(exerciseId);

      request.onsuccess = () => {
        const progressList = request.result.sort((a, b) => new Date(b.date) - new Date(a.date));
        resolve(progressList);
      };

      request.onerror = () => {
        console.error('Failed to get progress by exercise ID:', request.error);
        reject(request.error);
      };
    });
  }

  async getProgressByDateRange(startDate, endDate) {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const index = store.index('date');
      const range = IDBKeyRange.bound(startDate, endDate);
      const request = index.getAll(range);

      request.onsuccess = () => {
        const progressList = request.result.sort((a, b) => new Date(b.date) - new Date(a.date));
        resolve(progressList);
      };

      request.onerror = () => {
        console.error('Failed to get progress by date range:', request.error);
        reject(request.error);
      };
    });
  }

  async updateProgress(uuid, updateData) {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    return new Promise(async (resolve, reject) => {
      try {
        const existingProgress = await this.getProgressByUUID(uuid);
        if (!existingProgress) {
          reject(new Error('Progress not found'));
          return;
        }

        const updatedProgress = {
          ...existingProgress,
          ...updateData,
          updatedAt: new Date()
        };

        const transaction = this.db.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const request = store.put(updatedProgress);

        request.onsuccess = () => {
          console.log('Progress updated successfully:', uuid);
          resolve(updatedProgress);
        };

        request.onerror = () => {
          console.error('Failed to update progress:', request.error);
          reject(request.error);
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  async deleteProgress(uuid) {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(uuid);

      request.onsuccess = () => {
        console.log('Progress deleted successfully:', uuid);
        resolve(true);
      };

      request.onerror = () => {
        console.error('Failed to delete progress:', request.error);
        reject(request.error);
      };
    });
  }

  async clearAllProgress() {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.clear();

      request.onsuccess = () => {
        console.log('All progress cleared successfully');
        resolve(true);
      };

      request.onerror = () => {
        console.error('Failed to clear all progress:', request.error);
        reject(request.error);
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

  async getStatistics() {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    try {
      const allProgress = await this.getAllProgress();
      
      if (allProgress.length === 0) {
        return {
          totalExercises: 0,
          averageScore: 0,
          totalDuration: 0,
          uniqueExercises: 0
        };
      }

      const totalExercises = allProgress.length;
      const totalScore = allProgress.reduce((sum, progress) => sum + progress.confidenceScore, 0);
      const averageScore = Math.round(totalScore / totalExercises);
      const totalDuration = allProgress.reduce((sum, progress) => sum + progress.duration, 0);
      const uniqueExercises = [...new Set(allProgress.map(progress => progress.exerciseId))].length;

      return {
        totalExercises,
        averageScore,
        totalDuration,
        uniqueExercises
      };
    } catch (error) {
      console.error('Failed to get statistics:', error);
      throw error;
    }
  }
}

export default UserProgressStorage;
