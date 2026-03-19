'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  useAdminCRUD, DataTable, AdminModal, AdminPageHeader,
  Field, inputCls, textareaCls,
} from '@/components/admin/adminUtils';

export default function AdminVolunteering() {
  const { items, loading, create, update, remove } = useAdminCRUD('/api/volunteering');
  const [open,    setOpen]    = useState(false);
  const [editing, setEditing] = useState(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { title: '', description: '', order: 0 },
  });

  const openNew  = () => { setEditing(null); reset(); setOpen(true); };
  const openEdit = (item) => { setEditing(item); reset(item); setOpen(true); };

  const onSubmit = async (data) => {
    if (editing) await update(editing._id, data);
    else         await create(data);
    setOpen(false);
  };

  const columns = [
    { key: 'title',       label: 'Role' },
    { key: 'description', label: 'Description' },
    { key: 'order',       label: 'Order' },
  ];

  return (
    <>
      <AdminPageHeader title="Volunteering" onAdd={openNew} />
      <DataTable columns={columns} rows={items} loading={loading} onEdit={openEdit} onDelete={remove} />

      <AdminModal open={open} onClose={() => setOpen(false)}
        title={editing ? 'Edit Volunteering' : 'New Volunteering Role'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          <Field label="Role / Title" error={errors.title?.message}>
            <input {...register('title', { required: 'Required' })}
              placeholder="e.g. Teaching Assistant" className={inputCls} />
          </Field>

          <Field label="Description" error={errors.description?.message}>
            <textarea {...register('description', { required: 'Required' })}
              placeholder="What you did and the impact…" className={textareaCls} />
          </Field>

          <Field label="Order">
            <input {...register('order', { valueAsNumber: true })}
              type="number" className={`${inputCls} w-24`} />
          </Field>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={isSubmitting}
              className="flex-1 py-2.5 rounded-lg bg-primary text-black font-semibold hover:bg-yellow-300 transition disabled:opacity-60">
              {isSubmitting ? 'Saving…' : editing ? 'Save Changes' : 'Add Role'}
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
