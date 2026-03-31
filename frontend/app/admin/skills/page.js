// frontend/app/admin/skills/page.js
'use client';
import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { FiPlus, FiX } from 'react-icons/fi';
import {
  useAdminCRUD, DataTable, AdminModal, AdminPageHeader,
  Field, inputCls,
} from '@/components/admin/adminUtils';
import ImageUploader from '@/components/admin/ImageUploader';
import { apiFetch } from '@/lib/api'; 

// Reduced suggestions list
const SUGGESTIONS = ['Programming', 'Web Technologies', 'DevOps', 'Tools'];

export default function AdminSkills() {
  const { items, loading, create, update, remove } = useAdminCRUD('/api/skills');
  const [open,        setOpen]        = useState(false);
  const [editing,     setEditing]     = useState(null);
  const [customCat,   setCustomCat]   = useState(false);
  const [dbCategories, setDbCategories] = useState([]);

  const { register, handleSubmit, control, reset, setValue, watch,
    formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      category: '', customCategory: '', title: '',
      items: [{ label: '', logoUrl: '', logoPublicId: '' }], order: 0,
    },
  });

  const { fields, append, remove: removeItem } = useFieldArray({ control, name: 'items' });

  // Fetch unique categories from backend
  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await apiFetch('/api/skills/categories');
        if (data.success) setDbCategories(data.data || []);
      } catch (err) {
        console.error('Failed to fetch categories', err);
      }
    }
    fetchCategories();
  }, [items]); // Re-fetch if items change

  // Merged suggestions with database categories, removing duplicates
  const dynamicCategories = [...new Set([...SUGGESTIONS, ...dbCategories])];

  const openNew = () => {
    setEditing(null);
    setCustomCat(false);
    reset({ category: '', customCategory: '', title: '', items: [{ label: '', logoUrl: '', logoPublicId: '' }], order: 0 });
    setOpen(true);
  };

  const openEdit = (group) => {
    setEditing(group);
    const isCustom = !dynamicCategories.includes(group.category);
    setCustomCat(isCustom);
    reset({
      ...group,
      category:       isCustom ? '__custom__' : group.category,
      customCategory: isCustom ? group.category : '',
    });
    setOpen(true);
  };

  const onSubmit = async (data) => {
    const finalCategory = data.category === '__custom__'
      ? data.customCategory.trim()
      : data.category;

    if (!finalCategory) return;

    const payload = {
      ...data,
      category: finalCategory,
      items: data.items.filter(i => i.label && i.logoUrl),
    };
    delete payload.customCategory;

    if (editing) await update(editing._id, payload);
    else         await create(payload);
    setOpen(false);
  };

  const selectedCategory = watch('category');

  const columns = [
    { key: 'title',    label: 'Group' },
    { key: 'category', label: 'Category' },
    { key: 'items',    label: 'Skills', render: v => `${v?.length || 0} items` },
    { key: 'order',    label: 'Order' },
  ];

  return (
    <>
      <AdminPageHeader title="Skills & Technologies" onAdd={openNew} />
      <DataTable columns={columns} rows={items} loading={loading} onEdit={openEdit} onDelete={remove} />

      <AdminModal open={open} onClose={() => setOpen(false)}
        title={editing ? 'Edit Skill Group' : 'New Skill Group'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* FIXED Category Registration */}
          <Field label="Category" error={errors.category?.message}>
            <select
              {...register('category', {
                required: 'Category is required',
                onChange: (e) => setCustomCat(e.target.value === '__custom__')
              })}
              className={inputCls}
            >
              <option value="">Select a category…</option>
              {dynamicCategories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
              <option value="__custom__">+ Type a custom category…</option>
            </select>
          </Field>

          {(customCat || selectedCategory === '__custom__') && (
            <Field label="Custom Category Name" error={errors.customCategory?.message}>
              <input
                {...register('customCategory', {
                  validate: v => {
                    if (watch('category') === '__custom__' && !v?.trim()) return 'Custom category name is required';
                    return true;
                  }
                })}
                placeholder="e.g. Blockchain, AR/VR, Game Dev…"
                className={inputCls}
              />
            </Field>
          )}

          <Field label="Group Title" error={errors.title?.message}>
            <input {...register('title', { required: 'Title is required' })}
              placeholder="e.g. Cloud & DevOps" className={inputCls} />
          </Field>

          <Field label="Skills">
            <div className="space-y-3">
              {fields.map((f, i) => (
                <div key={f.id} className="p-3 rounded-lg bg-white/5 border border-white/10 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Skill #{i + 1}</span>
                    <button type="button" onClick={() => removeItem(i)}
                      className="text-gray-600 hover:text-red-400 bg-transparent">
                      <FiX size={13} />
                    </button>
                  </div>
                  <input {...register(`items.${i}.label`)}
                    placeholder="Label (e.g. Docker)" className={inputCls} />
                  <div className="flex gap-2 items-center">
                    <input {...register(`items.${i}.logoUrl`)}
                      placeholder="Logo URL (paste or upload)" className={inputCls} />
                    <ImageUploader
                      folder="portfolio/logos"
                      label="Upload"
                      accept="image/*,.svg"
                      preview={watch(`items.${i}.logoUrl`)}
                      onUpload={(url, pid) => {
                        setValue(`items.${i}.logoUrl`, url);
                        setValue(`items.${i}.logoPublicId`, pid);
                      }}
                    />
                  </div>
                </div>
              ))}
              <button type="button"
                onClick={() => append({ label: '', logoUrl: '', logoPublicId: '' })}
                className="text-xs text-yellow-400 hover:text-yellow-300 flex items-center gap-1 bg-transparent">
                <FiPlus size={12} /> Add skill
              </button>
            </div>
          </Field>

          <Field label="Order">
            <input {...register('order', { valueAsNumber: true })}
              type="number" className={`${inputCls} w-24`} />
          </Field>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={isSubmitting}
              className="flex-1 py-2.5 rounded-lg bg-yellow-400 text-black font-bold hover:bg-yellow-300 transition disabled:opacity-60">
              {isSubmitting ? 'Saving…' : editing ? 'Save Changes' : 'Create Group'}
            </button>
            <button type="button" onClick={() => setOpen(false)}
              className="px-5 py-2.5 rounded-lg border border-white/10 text-gray-400 hover:text-white transition bg-transparent">
              Cancel
            </button>
          </div>
        </form>
      </AdminModal>
    </>
  );
}