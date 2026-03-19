'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  useAdminCRUD, DataTable, AdminModal, AdminPageHeader,
  Field, inputCls,
} from '@/components/admin/adminUtils';
import ImageUploader from '@/components/admin/ImageUploader';

export default function AdminCertifications() {
  const { items, loading, create, update, remove } = useAdminCRUD('/api/certifications');
  const [open,    setOpen]    = useState(false);
  const [editing, setEditing] = useState(null);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      name: '', logoUrl: '', logoPublicId: '',
      url: '', issuer: '', inProgress: false, order: 0,
    },
  });

  const openNew  = () => { setEditing(null); reset(); setOpen(true); };
  const openEdit = (item) => { setEditing(item); reset(item); setOpen(true); };

  const onSubmit = async (data) => {
    if (editing) await update(editing._id, data);
    else         await create(data);
    setOpen(false);
  };

  const columns = [
    { key: 'logoUrl', label: 'Logo', render: (v) => v ? <img src={v} alt="" className="w-10 h-10 object-contain" /> : '–' },
    { key: 'name',       label: 'Name' },
    { key: 'issuer',     label: 'Issuer' },
    { key: 'inProgress', label: 'Status', render: v => v ? '🔄 In Progress' : '✅ Completed' },
  ];

  return (
    <>
      <AdminPageHeader title="Certifications" onAdd={openNew} />
      <DataTable columns={columns} rows={items} loading={loading} onEdit={openEdit} onDelete={remove} />

      <AdminModal open={open} onClose={() => setOpen(false)}
        title={editing ? 'Edit Certification' : 'New Certification'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          <Field label="Certification Name" error={errors.name?.message}>
            <input {...register('name', { required: 'Required' })}
              placeholder="e.g. AWS Certified Cloud Practitioner" className={inputCls} />
          </Field>

          <Field label="Issuer">
            <input {...register('issuer')} placeholder="e.g. Amazon Web Services" className={inputCls} />
          </Field>

          <Field label="Credential / Badge URL" error={errors.url?.message}>
            <input {...register('url', { required: 'Required' })}
              placeholder="https://…" className={inputCls} />
          </Field>

          <Field label="Badge / Logo">
            <div className="space-y-2">
              <ImageUploader
                folder="portfolio/certifications"
                label="Upload Badge"
                preview={watch('logoUrl')}
                onUpload={(url, pid) => { setValue('logoUrl', url); setValue('logoPublicId', pid); }}
              />
              <p className="text-xs text-gray-500">or paste a URL directly:</p>
              <input {...register('logoUrl')} placeholder="/certified_logos/badge.png" className={inputCls} />
            </div>
          </Field>

          <div className="flex gap-4 items-center">
            <Field label="Order">
              <input {...register('order', { valueAsNumber: true })}
                type="number" className={`${inputCls} w-24`} />
            </Field>
            <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer mt-5">
              <input {...register('inProgress')} type="checkbox" className="accent-primary w-4 h-4" />
              In Progress
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={isSubmitting}
              className="flex-1 py-2.5 rounded-lg bg-primary text-black font-semibold hover:bg-yellow-300 transition disabled:opacity-60">
              {isSubmitting ? 'Saving…' : editing ? 'Save Changes' : 'Add Certification'}
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
