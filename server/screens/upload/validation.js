export function validateUploadFile(file) {
  const errors = []
  if (!file) {
    errors.push('Image file is required')
    return errors
  }
  if (!file.mimetype || !file.mimetype.startsWith('image/')) {
    errors.push('Only image files are allowed')
  }
  return errors
}
