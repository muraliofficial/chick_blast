import { useState, useEffect } from 'react'
import { Plus, Pencil, Eye, EyeOff } from 'lucide-react'
import { itemsApi, uploadImage } from '../../shared/api'
import { CATEGORIES, LABELS } from '../../shared/constants'
import GradientModal from '../../shared/components/GradientModal'
import ModernSelect from '../../shared/components/ModernSelect'

const emptyForm = {
  name: '',
  unit: 'pc',
  category: CATEGORIES[0],
  label: LABELS[1],
  price: '',
  description: '',
  imageUrl: '',
}

function ItemFormModal({ isOpen, onClose, item, onSave }) {
  const [form, setForm] = useState(emptyForm)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (item) {
      setForm({
        name: item.name || '',
        unit: item.unit || 'pc',
        category: item.category || CATEGORIES[0],
        label: item.label || LABELS[1],
        price: item.price ?? '',
        description: item.description || '',
        imageUrl: item.imageUrl || '',
      })
    } else {
      setForm(emptyForm)
    }
  }, [item, isOpen])

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadImage(file)
      setForm((f) => ({ ...f, imageUrl: url }))
    } catch (err) {
      alert(err.message)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const data = { ...form, price: Number(form.price), type: 'item' }
      if (item?.id) {
        await itemsApi.update(item.id, data)
      } else {
        await itemsApi.create(data)
      }
      onSave()
      onClose()
    } catch (err) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <GradientModal
      isOpen={isOpen}
      onClose={onClose}
      title={item ? 'Edit Item' : 'Add Item'}
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-4 items-start">
          <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
            {form.imageUrl ? (
              <img src={form.imageUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl">🍗</div>
            )}
          </div>
          <div className="flex-1">
            <label className="btn-outline cursor-pointer inline-block">
              {uploading ? 'Uploading...' : 'Upload Image'}
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
          </div>
        </div>

        <input
          className="input-field"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            className="input-field"
            placeholder="Unit (pc, plate, etc.)"
            value={form.unit}
            onChange={(e) => setForm({ ...form, unit: e.target.value })}
          />
          <input
            className="input-field"
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
            min="0"
            step="0.01"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <ModernSelect
            options={CATEGORIES}
            value={form.category}
            onChange={(v) => setForm({ ...form, category: v })}
            label="Category"
          />
          <ModernSelect
            options={LABELS}
            value={form.label}
            onChange={(v) => setForm({ ...form, label: v })}
            label="Food Type"
          />
        </div>

        <textarea
          className="input-field resize-none"
          placeholder="Description"
          rows={3}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <div className="flex gap-3 justify-end pt-2">
          <button type="button" onClick={onClose} className="btn-outline">Cancel</button>
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Saving...' : item ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </GradientModal>
  )
}

export default function Items() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editItem, setEditItem] = useState(null)

  const loadItems = () => {
    itemsApi
      .getAllAdmin()
      .then((data) => setItems(data.filter((i) => i.type !== 'combo')))
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadItems()
  }, [])

  const toggleHide = async (item) => {
    try {
      await itemsApi.update(item.id, { isActive: !item.isActive })
      loadItems()
    } catch (err) {
      alert(err.message)
    }
  }

  const openAdd = () => {
    setEditItem(null)
    setModalOpen(true)
  }

  const openEdit = (item) => {
    setEditItem(item)
    setModalOpen(true)
  }

  return (
    <div>
      <div className="admin-page-header">
        <h2>Items</h2>
        <button onClick={openAdd} className="btn-primary">
          <Plus size={18} /> Add Item
        </button>
      </div>

      <div className="admin-table">
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Label</th>
              <th>Price</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="text-center py-8 text-gray-400">Loading...</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-8 text-gray-400">No items yet</td></tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className={item.isActive === false ? 'opacity-60 bg-gray-50' : ''}>
                  <td>
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">🍗</div>
                      )}
                    </div>
                  </td>
                  <td className="font-medium">{item.name}</td>
                  <td>{item.category}</td>
                  <td>
                    <span className={item.label === 'Veg' ? 'label-badge-veg' : 'label-badge-nonveg'}>
                      {item.label}
                    </span>
                  </td>
                  <td className="font-semibold">₹{item.price}</td>
                  <td>
                    {item.isActive === false ? (
                      <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-200 text-gray-600">
                        Hidden
                      </span>
                    ) : (
                      <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                        Visible
                      </span>
                    )}
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleHide(item)}
                        title={item.isActive === false ? 'Unhide item on website' : 'Hide item from website'}
                        className={`p-2 rounded-lg cursor-pointer border-none transition-colors ${
                          item.isActive === false
                            ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                            : 'hover:bg-gray-100 text-gray-500'
                        }`}
                      >
                        {item.isActive === false ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      <button
                        onClick={() => openEdit(item)}
                        title="Edit item"
                        className="p-2 rounded-lg hover:bg-gray-100 cursor-pointer border-none bg-transparent"
                      >
                        <Pencil size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ItemFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        item={editItem}
        onSave={loadItems}
      />
    </div>
  )
}
