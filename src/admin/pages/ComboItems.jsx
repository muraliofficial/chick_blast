import { useState, useEffect } from 'react'
import { Plus, Trash2, Pencil, Eye, EyeOff } from 'lucide-react'
import { itemsApi, uploadImage } from '../../shared/api'
import { CATEGORIES, LABELS } from '../../shared/constants'
import GradientModal from '../../shared/components/GradientModal'
import ModernSelect from '../../shared/components/ModernSelect'
import FssaiBadge from '../../shared/components/FssaiBadge'

const emptyForm = {
  name: '',
  unit: 'combo',
  category: 'Fried Chicken',
  label: 'Non-Veg',
  price: '',
  description: '',
  imageUrl: '',
  comboItemIds: [],
}

function ComboFormModal({ isOpen, onClose, combo, allItems, onSave }) {
  const [form, setForm] = useState(emptyForm)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (combo) {
      setForm({
        name: combo.name || '',
        unit: combo.unit || 'combo',
        category: combo.category || 'Fried Chicken',
        label: combo.label || 'Non-Veg',
        price: combo.price ?? '',
        description: combo.description || '',
        imageUrl: combo.imageUrl || '',
        comboItemIds: combo.comboItemIds || [],
      })
    } else {
      setForm(emptyForm)
    }
  }, [combo, isOpen])

  const toggleItem = (id) => {
    const updatedIds = form.comboItemIds.includes(id)
      ? form.comboItemIds.filter((i) => i !== id)
      : [...form.comboItemIds, id]

    // Auto-detect label: if all selected items are Veg, set to Veg, otherwise Non-Veg
    const selectedItems = allItems.filter((i) => updatedIds.includes(i.id))
    const autoLabel = selectedItems.length > 0 && selectedItems.every((i) => i.label === 'Veg') ? 'Veg' : 'Non-Veg'

    setForm((f) => ({
      ...f,
      comboItemIds: updatedIds,
      label: autoLabel,
    }))
  }

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
    if (form.comboItemIds.length < 2) {
      alert('Select at least 2 items for a combo')
      return
    }
    setSaving(true)
    try {
      const data = { ...form, price: Number(form.price), type: 'combo' }
      if (combo?.id) {
        await itemsApi.update(combo.id, data)
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
      title={combo ? 'Edit Combo' : 'Create Combo'}
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-4 items-start">
          <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
            {form.imageUrl ? (
              <img src={form.imageUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl">🍱</div>
            )}
          </div>
          <div>
            <label className="btn-outline cursor-pointer inline-block">
              {uploading ? 'Uploading...' : 'Upload Image'}
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
          </div>
        </div>

        <input
          className="input-field"
          placeholder="Combo Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            className="input-field"
            type="number"
            placeholder="Combo Price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
            min="0"
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
          rows={2}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <div>
          <p className="text-sm font-semibold mb-2">Select Items ({form.comboItemIds.length} selected)</p>
          <div className="max-h-48 overflow-y-auto space-y-2 border border-gray-200 rounded-xl p-3">
            {allItems.map((item) => (
              <label
                key={item.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={form.comboItemIds.includes(item.id)}
                  onChange={() => toggleItem(item.id)}
                />
                <span className="flex-1 text-sm">{item.name}</span>
                <FssaiBadge isVeg={item.label === 'Veg'} size={16} />
                <span className="text-sm text-gray-500">₹{item.price}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-3 justify-end pt-2">
          <button type="button" onClick={onClose} className="btn-outline">Cancel</button>
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Saving...' : combo ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </GradientModal>
  )
}

export default function ComboItems() {
  const [combos, setCombos] = useState([])
  const [allItems, setAllItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editCombo, setEditCombo] = useState(null)

  const loadData = () => {
    itemsApi
      .getAllAdmin()
      .then((all) => {
        setCombos(all.filter((i) => i.type === 'combo'))
        setAllItems(all.filter((i) => i.type !== 'combo'))
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadData()
  }, [])

  const toggleHide = async (combo) => {
    try {
      await itemsApi.update(combo.id, { isActive: !combo.isActive })
      loadData()
    } catch (err) {
      alert(err.message)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this combo?')) return
    try {
      await itemsApi.delete(id)
      loadData()
    } catch (err) {
      alert(err.message)
    }
  }

  const getItemNames = (ids) => {
    return ids
      ?.map((id) => allItems.find((i) => i.id === id)?.name)
      .filter(Boolean)
      .join(', ')
  }

  return (
    <div>
      <div className="admin-page-header">
        <h2>Combo Items</h2>
        <button
          onClick={() => { setEditCombo(null); setModalOpen(true) }}
          className="btn-primary"
        >
          <Plus size={18} /> Create Combo
        </button>
      </div>

      <div className="admin-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Items</th>
              <th>Label</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center py-8 text-gray-400">Loading...</td></tr>
            ) : combos.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-8 text-gray-400">No combos yet</td></tr>
            ) : (
              combos.map((combo) => (
                <tr key={combo.id} className={combo.isActive === false ? 'opacity-60 bg-gray-50' : ''}>
                  <td className="font-medium">{combo.name}</td>
                  <td className="text-sm text-gray-600 max-w-xs truncate">
                    {getItemNames(combo.comboItemIds)}
                  </td>
                  <td>
                    <FssaiBadge isVeg={combo.label === 'Veg'} size={18} />
                  </td>
                  <td className="font-semibold">₹{combo.price}</td>
                  <td>
                    {combo.isActive === false ? (
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
                    <div className="flex gap-1 items-center">
                      <button
                        onClick={() => toggleHide(combo)}
                        title={combo.isActive === false ? 'Unhide combo on website' : 'Hide combo from website'}
                        className={`p-2 rounded-lg cursor-pointer border-none transition-colors ${
                          combo.isActive === false
                            ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                            : 'hover:bg-gray-100 text-gray-500'
                        }`}
                      >
                        {combo.isActive === false ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      <button
                        onClick={() => { setEditCombo(combo); setModalOpen(true) }}
                        title="Edit combo"
                        className="p-2 rounded-lg hover:bg-gray-100 cursor-pointer border-none bg-transparent"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(combo.id)}
                        title="Delete combo"
                        className="p-2 rounded-lg hover:bg-red-50 text-red-500 cursor-pointer border-none bg-transparent"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ComboFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        combo={editCombo}
        allItems={allItems}
        onSave={loadData}
      />
    </div>
  )
}
