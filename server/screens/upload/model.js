const IMGBB_API_KEY = process.env.IMGBB_API_KEY || '2ef50f4aed2cd9fd117b433cbca4ca51'

export async function uploadToImgBB(fileBuffer, filename = 'image.jpg') {
  const base64Image = fileBuffer.toString('base64')
  const formData = new URLSearchParams()
  formData.append('key', IMGBB_API_KEY)
  formData.append('image', base64Image)

  const response = await fetch('https://api.imgbb.com/1/upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData.toString(),
  })

  const data = await response.json()

  if (!data.success) {
    throw new Error(data.error?.message || 'Failed to upload image to ImgBB')
  }

  return data.data.url
}
