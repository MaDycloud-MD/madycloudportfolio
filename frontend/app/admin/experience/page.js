'use client';
import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { FiPlus, FiX } from 'react-icons/fi';
import {
  useAdminCRUD, DataTable, AdminModal, AdminPageHeader,
  Field, inputCls,
} from '@/components/admin/adminUtils';
import ImageUploader from '@/components/admin/ImageUploader';

export default function AdminExperience() {
  const { items, loading, create, update, remove } = useAdminCRUD('/api/experience');
  const [open,    setOpen]    = useState(false);
  const [editing, setEditing] = useState(null);

  const { register, handleSubmit, control, reset, setValue, watch, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      role: '', company: '', duration: '', points: [{ value: '' }],
      companyLogo: '', companyLogoPublicId: '', current: false, order: 0,
    },
  });

  const { fields, append, remove: removePoint } = useFieldArray({ control, name: 'points' });

  const openNew = () => { setEditing(null); reset(); setOpen(true); };
  const openEdit = (item) => {
    setEditing(item);
    reset({ ...item, points: item.points.map(p => ({ value: p })) });
    setOpen(true);
  };

  const onSubmit = async (data) => {
    const payload = { ...data, points: data.points.map(p => p.value).filter(Boolean) };
    if (editing) await update(editing._id, payload);
    else         await create(payload);
    setOpen(false);
  };

  const columns = [
    { key: 'role',     label: 'Role' },
    { key: 'company',  label: 'Company' },
    { key: 'duration', label: 'Duration' },
    { key: 'current',  label: 'Current', render: v => v ? '✅ Yes' : 'No' },
  ];

  return (
    <>
      <AdminPageHeader title="Experience" onAdd={openNew} />
      <DataTable columns={columns} rows={items} loading={loading} onEdit={openEdit} onDelete={remove} />

      <AdminModal open={open} onClose={() => setOpen(false)}
        title={editing ? 'Edit Experience' : 'New Experience'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          <Field label="Role / Job Title" error={errors.role?.message}>
            <input {...register('role', { required: 'Required' })}
              placeholder="e.g. Junior Cloud Engineer Intern" className={inputCls} />
          </Field>

          <Field label="Company" error={errors.company?.message}>
            <input {...register('company', { required: 'Required' })}
              placeholder="e.g. Eyesec Cybersecurity Solution Pvt. Ltd" className={inputCls} />
          </Field>

          <Field label="Duration (display string)" error={errors.duration?.message}>
            <input {...register('duration', { required: 'Required' })}
              placeholder="e.g. Mar 2023 – Jun 2023" className={inputCls} />
          </Field>

          <Field label="Bullet Points">
            <div className="space-y-2">
              {fields.map((f, i) => (
                <div key={f.id} className="flex gap-2">
                  <input {...register(`points.${i}.value`)}
                    placeholder={`Point ${i + 1}`} className={inputCls} />
                  <button type="button" onClick={() => removePoint(i)}
                    className="text-gray-500 hover:text-red-400 bg-transparent flex-shrink-0">
                    <FiX />
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => append({ value: '' })}
                className="text-xs text-primary hover:underline flex items-center gap-1 bg-transparent">
                <FiPlus size={12} /> Add point
              </button>
            </div>
          </Field>

          <Field label="Company Logo">
            <ImageUploader
              folder="portfolio/logos"
              label="Upload Logo"
              preview={watch('companyLogo')}
              onUpload={(url, pid) => { setValue('companyLogo', url); setValue('companyLogoPublicId', pid); }}
            />
          </Field>

          <div className="flex gap-4 items-center">
            <Field label="Order">
              <input {...register('order', { valueAsNumber: true })}
                type="number" className={`${inputCls} w-24`} />
            </Field>
            <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer mt-5">
              <input {...register('current')} type="checkbox" className="accent-primary w-4 h-4" />
              Currently working here
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={isSubmitting}
              className="flex-1 py-2.5 rounded-lg bg-primary text-black font-semibold hover:bg-yellow-300 transition disabled:opacity-60">
              {isSubmitting ? 'Saving…' : editing ? 'Save Changes' : 'Add Experience'}
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
