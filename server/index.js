import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { initFirebase } from './config/firebase.js'
import itemsRouter from './screens/items/routes.js'
import ordersRouter from './screens/orders/routes.js'
import dashboardRouter from './screens/dashboard/routes.js'
import uploadRouter from './screens/upload/routes.js'

dotenv.config()

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3001

initFirebase()

app.use(cors())
app.use(express.json())

app.use('/api/items', itemsRouter)
app.use('/api/orders', ordersRouter)
app.use('/api/upload', uploadRouter)
app.use('/api/dashboard', dashboardRouter)

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

const distPath = path.join(__dirname, '..', 'dist')
app.use(express.static(distPath))

app.use((req, res, next) => {
  if (req.path.startsWith('/api')) return next()
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) res.status(404).send('Not found')
  })
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Chick Blast API running on http://0.0.0.0:${PORT}`)
})
