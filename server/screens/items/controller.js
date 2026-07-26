import {
  fetchItems,
  fetchAllItemsAdmin,
  createItemInDb,
  updateItemInDb,
  deleteItemInDb,
} from './model.js'
import { validateCreateItem, validateUpdateItem } from './validation.js'

export async function getItemsController(req, res) {
  try {
    const { type, includeInactive } = req.query
    const items = await fetchItems({ type, includeInactive })
    res.json(items)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function getAllItemsAdminController(req, res) {
  try {
    const items = await fetchAllItemsAdmin()
    res.json(items)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function createItemController(req, res) {
  try {
    const errors = validateCreateItem(req.body)
    if (errors.length > 0) {
      return res.status(400).json({ error: errors.join(', ') })
    }

    const createdItem = await createItemInDb(req.body)
    res.status(201).json(createdItem)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function updateItemController(req, res) {
  try {
    const errors = validateUpdateItem(req.body)
    if (errors.length > 0) {
      return res.status(400).json({ error: errors.join(', ') })
    }

    const updatedItem = await updateItemInDb(req.params.id, req.body)
    if (!updatedItem) {
      return res.status(404).json({ error: 'Item not found' })
    }
    res.json(updatedItem)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export async function deleteItemController(req, res) {
  try {
    const success = await deleteItemInDb(req.params.id)
    if (!success) {
      return res.status(404).json({ error: 'Item not found' })
    }
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
