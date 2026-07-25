import axios from 'axios'

export async function uploadToImgBB(buffer, filename) {
  const apiKey = process.env.IMGBB_API_KEY
  if (!apiKey) {
    // Fallback: return data URL for image when IMGBB key is not configured
    const mimeType = filename.endsWith('.png') ? 'image/png' : 'image/jpeg'
    return `data:${mimeType};base64,${buffer.toString('base64')}`
  }

  const response = await axios.post(
    `https://api.imgbb.com/1/upload?key=${apiKey}&name=${encodeURIComponent(filename)}`,
    new URLSearchParams({ image: buffer.toString('base64') }),
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  )

  if (!response.data?.success) {
    throw new Error('Image upload failed')
  }

  return response.data.data.url
}
