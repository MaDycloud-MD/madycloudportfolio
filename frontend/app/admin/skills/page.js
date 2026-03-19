'use client';
import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { FiPlus, FiX } from 'react-icons/fi';
import {
  useAdminCRUD, DataTable, AdminModal, AdminPageHeader,
  Field, inputCls,
} from '@/components/admin/adminUtils';
import ImageUploader from '@/components/admin/ImageUploader';

const CATEGORIES = ['Programming', 'DevOps', 'Databases', 'Operating Systems', 'Tools'];

export default function AdminSkills() {
  const { items, loading, create, update, remove } = useAdminCRUD('/api/skills');
  const [open,    setOpen]    = useState(false);
  const [editing, setEditing] = useState(null);

  const { register, handleSubmit, control, reset, setValue, watch, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      category: 'DevOps',
      title: '',
      items: [{ label: '', logoUrl: '', logoPublicId: '' }],
      order: 0,
    },
  });

  const { fields, append, remove: removeItem } = useFieldArray({ control, name: 'items' });

  const openNew = () => { setEditing(null); reset(); setOpen(true); };
  const openEdit = (group) => { setEditing(group); reset(group); setOpen(true); };

  const onSubmit = async (data) => {
    const payload = { ...data, items: data.items.filter(i => i.label && i.logoUrl) };
    if (editing) await update(editing._id, payload);
    else         await create(payload);
    setOpen(false);
  };

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

          <Field label="Category" error={errors.category?.message}>
            <select {...register('category', { required: 'Required' })}
              className={inputCls}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>

          <Field label="Group Title" error={errors.title?.message}>
            <input {...register('title', { required: 'Required' })}
              placeholder="e.g. Cloud & DevOps" className={inputCls} />
          </Field>

          {/* Skill items */}
          <Field label="Skills">
            <div className="space-y-3">
              {fields.map((f, i) => (
                <div key={f.id} className="p-3 rounded-lg bg-white/5 border border-white/10 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">Skill #{i + 1}</span>
                    <button type="button" onClick={() => removeItem(i)}
                      className="text-gray-500 hover:text-red-400 bg-transparent">
                      <FiX size={14} />
                    </button>
                  </div>
                  <input {...register(`items.${i}.label`)}
                    placeholder="Label (e.g. Docker)" className={inputCls} />
                  <div className="flex gap-2 items-center">
                    <input {...register(`items.${i}.logoUrl`)}
                      placeholder="Logo URL" className={inputCls} />
                    <ImageUploader
                      folder="portfolio/logos"
                      label="Upload"
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
                className="text-xs text-primary hover:underline flex items-center gap-1 bg-transparent">
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
              className="flex-1 py-2.5 rounded-lg bg-primary text-black font-semibold hover:bg-yellow-300 transition disabled:opacity-60">
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
