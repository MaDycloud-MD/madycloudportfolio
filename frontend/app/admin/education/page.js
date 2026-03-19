'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  useAdminCRUD, DataTable, AdminModal, AdminPageHeader,
  Field, inputCls,
} from '@/components/admin/adminUtils';

export default function AdminEducation() {
  const { items, loading, create, update, remove } = useAdminCRUD('/api/education');
  const [open,    setOpen]    = useState(false);
  const [editing, setEditing] = useState(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { degree: '', institution: '', score: '', year: '', order: 0 },
  });

  const openNew  = () => { setEditing(null); reset(); setOpen(true); };
  const openEdit = (item) => { setEditing(item); reset(item); setOpen(true); };

  const onSubmit = async (data) => {
    if (editing) await update(editing._id, data);
    else         await create(data);
    setOpen(false);
  };

  const columns = [
    { key: 'degree',      label: 'Degree' },
    { key: 'institution', label: 'Institution' },
    { key: 'score',       label: 'Score' },
    { key: 'year',        label: 'Year' },
  ];

  return (
    <>
      <AdminPageHeader title="Education" onAdd={openNew} />
      <DataTable columns={columns} rows={items} loading={loading} onEdit={openEdit} onDelete={remove} />

      <AdminModal open={open} onClose={() => setOpen(false)}
        title={editing ? 'Edit Education' : 'New Education'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          <Field label="Degree / Qualification" error={errors.degree?.message}>
            <input {...register('degree', { required: 'Required' })}
              placeholder="e.g. Bachelor of Computer Applications [BCA]" className={inputCls} />
          </Field>

          <Field label="Institution" error={errors.institution?.message}>
            <input {...register('institution', { required: 'Required' })}
              placeholder="e.g. Rani Channamma University, Karnataka." className={inputCls} />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Score / CGPA">
              <input {...register('score')} placeholder="e.g. CGPA: 9.52" className={inputCls} />
            </Field>
            <Field label="Year">
              <input {...register('year')} placeholder="e.g. 2020 - 2023 or Pursuing" className={inputCls} />
            </Field>
          </div>

          <Field label="Order">
            <input {...register('order', { valueAsNumber: true })}
              type="number" className={`${inputCls} w-24`} />
          </Field>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={isSubmitting}
              className="flex-1 py-2.5 rounded-lg bg-primary text-black font-semibold hover:bg-yellow-300 transition disabled:opacity-60">
              {isSubmitting ? 'Saving…' : editing ? 'Save Changes' : 'Add Education'}
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
