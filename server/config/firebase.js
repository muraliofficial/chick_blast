import dotenv from 'dotenv'
import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'
import admin from 'firebase-admin'

dotenv.config()

let db = null

export function initFirebase() {
  if (db) return db

  const projectId = process.env.FIREBASE_PROJECT_ID
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')

  if (!projectId || !clientEmail || !privateKey) {
    console.warn('Firebase credentials missing — using mock mode for development')
    return null
  }

  try {
    const apps = getApps()
    if (!apps.length) {
      initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      })
    }

    db = getFirestore()
    console.log('Firebase Firestore initialized successfully!')
    return db
  } catch (err) {
    console.error('Firebase initialization error:', err.message)
    return null
  }
}

export function getDb() {
  if (!db) {
    db = initFirebase()
  }
  return db
}

export { admin, FieldValue }
