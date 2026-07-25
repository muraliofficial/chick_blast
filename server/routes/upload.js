import { Router } from 'express'
import multer from 'multer'
import { uploadToImgBB } from '../services/uploadService.js'

const router = Router()
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } })

router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' })
    }

    const url = await uploadToImgBB(req.file.buffer, req.file.originalname)
    res.json({ url })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
