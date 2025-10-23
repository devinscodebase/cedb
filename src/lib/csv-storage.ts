/**
 * CSV Storage Utility using IndexedDB
 * 
 * IndexedDB supports much larger files than sessionStorage
 * Typical limits: 50MB - 1GB+ depending on browser
 */

const DB_NAME = 'cedb_uploads'
const STORE_NAME = 'csv_files'
const DB_VERSION = 1

interface CSVUpload {
  id: string
  file: Blob
  fileName: string
  timestamp: number
}

/**
 * Initialize IndexedDB
 */
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    }
  })
}

/**
 * Store CSV file in IndexedDB
 */
export async function storeCsvFile(file: File): Promise<void> {
  const db = await openDB()
  
  const upload: CSVUpload = {
    id: 'current_upload', // Always use same ID to replace previous upload
    file: file,
    fileName: file.name,
    timestamp: Date.now(),
  }
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.put(upload)
    
    request.onsuccess = () => {
      db.close()
      resolve()
    }
    request.onerror = () => {
      db.close()
      reject(request.error)
    }
  })
}

/**
 * Retrieve CSV file from IndexedDB
 */
export async function getCsvFile(): Promise<{ file: File; fileName: string } | null> {
  const db = await openDB()
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.get('current_upload')
    
    request.onsuccess = () => {
      db.close()
      const result = request.result as CSVUpload | undefined
      
      if (result) {
        const file = new File([result.file], result.fileName, { type: 'text/csv' })
        resolve({ file, fileName: result.fileName })
      } else {
        resolve(null)
      }
    }
    request.onerror = () => {
      db.close()
      reject(request.error)
    }
  })
}

/**
 * Delete CSV file from IndexedDB
 */
export async function deleteCsvFile(): Promise<void> {
  const db = await openDB()
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.delete('current_upload')
    
    request.onsuccess = () => {
      db.close()
      resolve()
    }
    request.onerror = () => {
      db.close()
      reject(request.error)
    }
  })
}

/**
 * Clear all stored CSV files
 */
export async function clearAllCsvFiles(): Promise<void> {
  const db = await openDB()
  
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.clear()
    
    request.onsuccess = () => {
      db.close()
      resolve()
    }
    request.onerror = () => {
      db.close()
      reject(request.error)
    }
  })
}

