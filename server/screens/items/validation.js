export function validateCreateItem(body) {
  const errors = []
  if (!body.name || typeof body.name !== 'string' || !body.name.trim()) {
    errors.push('Name is required')
  }
  if (body.price == null || isNaN(Number(body.price))) {
    errors.push('Valid price is required')
  }
  return errors
}

export function validateUpdateItem(body) {
  const errors = []
  if (body.price !== undefined && isNaN(Number(body.price))) {
    errors.push('Price must be a valid number')
  }
  return errors
}
