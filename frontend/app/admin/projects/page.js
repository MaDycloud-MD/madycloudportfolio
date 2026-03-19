'use client';
import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { FiPlus, FiX } from 'react-icons/fi';
import {
  useAdminCRUD, DataTable, AdminModal, AdminPageHeader,
  Field, inputCls, textareaCls,
} from '@/components/admin/adminUtils';
import ImageUploader from '@/components/admin/ImageUploader';

export default function AdminProjects() {
  const { items, loading, create, update, remove } = useAdminCRUD('/api/projects');
  const [open,    setOpen]    = useState(false);
  const [editing, setEditing] = useState(null);

  const { register, handleSubmit, control, reset, setValue, watch, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      title: '', description: '', details: [{ value: '' }],
      techStack: [{ name: '', logoUrl: '' }],
      links: { github: '', live: '', youtube: '' },
      coverImage: '', coverImagePublicId: '', featured: false, order: 0,
    },
  });

  const { fields: detailFields, append: addDetail, remove: removeDetail } =
    useFieldArray({ control, name: 'details' });
  const { fields: techFields, append: addTech, remove: removeTech } =
    useFieldArray({ control, name: 'techStack' });

  const openNew = () => {
    setEditing(null);
    reset();
    setOpen(true);
  };

  const openEdit = (proj) => {
    setEditing(proj);
    reset({
      ...proj,
      details:   proj.details.map(d => ({ value: d })),
      links:     proj.links || {},
    });
    setOpen(true);
  };

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      details:   data.details.map(d => d.value).filter(Boolean),
      techStack: data.techStack.filter(t => t.name && t.logoUrl),
    };
    if (editing) await update(editing._id, payload);
    else         await create(payload);
    setOpen(false);
  };

  const coverUrl = watch('coverImage');

  const columns = [
    { key: 'title',    label: 'Title' },
    { key: 'featured', label: 'Featured', render: v => v ? '⭐ Yes' : 'No' },
    { key: 'order',    label: 'Order' },
    { key: 'techStack', label: 'Stack', render: v => `${v?.length || 0} tools` },
  ];

  return (
    <>
      <AdminPageHeader title="Projects" onAdd={openNew} />
      <DataTable columns={columns} rows={items} loading={loading} onEdit={openEdit} onDelete={remove} />

      <AdminModal open={open} onClose={() => setOpen(false)}
        title={editing ? 'Edit Project' : 'New Project'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          <Field label="Title" error={errors.title?.message}>
            <input {...register('title', { required: 'Required' })}
              placeholder="Project title" className={inputCls} />
          </Field>

          <Field label="Description" error={errors.description?.message}>
            <textarea {...register('description', { required: 'Required' })}
              placeholder="Short description" className={textareaCls} rows={3} />
          </Field>

          {/* Bullet details */}
          <Field label="Details (bullet points)">
            <div className="space-y-2">
              {detailFields.map((f, i) => (
                <div key={f.id} className="flex gap-2">
                  <input {...register(`details.${i}.value`)}
                    placeholder={`Point ${i + 1}`} className={inputCls} />
                  <button type="button" onClick={() => removeDetail(i)}
                    className="text-gray-500 hover:text-red-400 transition bg-transparent flex-shrink-0">
                    <FiX />
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => addDetail({ value: '' })}
                className="text-xs text-primary hover:underline flex items-center gap-1 bg-transparent">
                <FiPlus size={12} /> Add bullet point
              </button>
            </div>
          </Field>

          {/* Tech stack */}
          <Field label="Tech Stack">
            <div className="space-y-3">
              {techFields.map((f, i) => (
                <div key={f.id} className="flex gap-2 items-start">
                  <div className="flex-1 space-y-1.5">
                    <input {...register(`techStack.${i}.name`)}
                      placeholder="Name (e.g. Docker)" className={inputCls} />
                    <div className="flex gap-2 items-center">
                      <input {...register(`techStack.${i}.logoUrl`)}
                        placeholder="Logo URL" className={inputCls} />
                      <ImageUploader
                        folder="portfolio/logos"
                        label="Upload"
                        preview={watch(`techStack.${i}.logoUrl`)}
                        onUpload={(url) => setValue(`techStack.${i}.logoUrl`, url)}
                      />
                    </div>
                  </div>
                  <button type="button" onClick={() => removeTech(i)}
                    className="text-gray-500 hover:text-red-400 mt-2 bg-transparent flex-shrink-0">
                    <FiX />
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => addTech({ name: '', logoUrl: '' })}
                className="text-xs text-primary hover:underline flex items-center gap-1 bg-transparent">
                <FiPlus size={12} /> Add tech
              </button>
            </div>
          </Field>

          {/* Links */}
          <Field label="GitHub URL">
            <input {...register('links.github')} placeholder="https://github.com/…" className={inputCls} />
          </Field>
          <Field label="Live URL">
            <input {...register('links.live')} placeholder="https://…" className={inputCls} />
          </Field>
          <Field label="YouTube URL">
            <input {...register('links.youtube')} placeholder="https://youtu.be/…" className={inputCls} />
          </Field>

          {/* Cover image */}
          <Field label="Cover Image">
            <ImageUploader
              folder="portfolio/projects"
              label="Upload Cover"
              preview={coverUrl}
              onUpload={(url, pid) => { setValue('coverImage', url); setValue('coverImagePublicId', pid); }}
            />
          </Field>

          <div className="flex gap-4">
            <Field label="Order">
              <input {...register('order', { valueAsNumber: true })}
                type="number" placeholder="0" className={`${inputCls} w-24`} />
            </Field>
            <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer mt-5">
              <input {...register('featured')} type="checkbox" className="accent-primary w-4 h-4" />
              Featured
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={isSubmitting}
              className="flex-1 py-2.5 rounded-lg bg-primary text-black font-semibold
                hover:bg-yellow-300 transition disabled:opacity-60">
              {isSubmitting ? 'Saving…' : editing ? 'Save Changes' : 'Create Project'}
            </button>
            <button type="button" onClick={() => setOpen(false)}
              className="px-5 py-2.5 rounded-lg border border-white/10 text-gray-400
                hover:text-white transition bg-transparent">
              Cancel
            </button>
          </div>
        </form>
      </AdminModal>
    </>
  );
}
