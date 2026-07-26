import { uploadToImgBB } from './model.js'
import { validateUploadFile } from './validation.js'

export async function uploadImageController(req, res) {
  try {
    const errors = validateUploadFile(req.file)
    if (errors.length > 0) {
      return res.status(400).json({ error: errors.join(', ') })
    }

    const url = await uploadToImgBB(req.file.buffer, req.file.originalname)
    res.json({ url })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
