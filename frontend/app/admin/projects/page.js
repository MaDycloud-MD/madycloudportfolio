// frontend/app/admin/projects/page.js
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
  const [saveErr, setSaveErr] = useState('');

  const {
    register, handleSubmit, control, reset, setValue, watch,
    formState: { errors, isSubmitting },
  } = useForm({
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
    setSaveErr('');
    reset({
      title: '', description: '', details: [{ value: '' }],
      techStack: [{ name: '', logoUrl: '' }],
      links: { github: '', live: '', youtube: '' },
      coverImage: '', coverImagePublicId: '', featured: false, order: 0,
    });
    setOpen(true);
  };

  const openEdit = (proj) => {
    setEditing(proj);
    setSaveErr('');
    reset({
      ...proj,
      details:  proj.details?.map(d => ({ value: d })) || [{ value: '' }],
      links:    proj.links || { github: '', live: '', youtube: '' },
    });
    setOpen(true);
  };

  const onSubmit = async (data) => {
    setSaveErr('');
    try {
      const payload = {
        title:             data.title,
        description:       data.description,
        details:           data.details.map(d => d.value).filter(Boolean),
        techStack:         data.techStack.filter(t => t.name && t.logoUrl),
        links: {
          github:  data.links?.github  || '',
          live:    data.links?.live    || '',
          youtube: data.links?.youtube || '',
        },
        coverImage:        data.coverImage        || '',
        coverImagePublicId: data.coverImagePublicId || '',
        featured:          data.featured || false,
        order:             Number(data.order) || 0,
      };

      if (editing) await update(editing._id, payload);
      else         await create(payload);
      setOpen(false);
    } catch (err) {
      setSaveErr(err.message || 'Failed to save. Please try again.');
    }
  };

  const coverUrl = watch('coverImage');

  const columns = [
    { key: 'title',     label: 'Title' },
    { key: 'featured',  label: 'Featured', render: v => v ? 'Yes' : 'No' },
    { key: 'order',     label: 'Order' },
    { key: 'techStack', label: 'Stack', render: v => `${v?.length || 0} tools` },
  ];

  return (
    <>
      <AdminPageHeader title="Projects" onAdd={openNew} />
      <DataTable columns={columns} rows={items} loading={loading} onEdit={openEdit} onDelete={remove} />

      <AdminModal open={open} onClose={() => setOpen(false)}
        title={editing ? 'Edit Project' : 'New Project'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Save error */}
          {saveErr && (
            <div className="px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {saveErr}
            </div>
          )}

          <Field label="Title" error={errors.title?.message}>
            <input {...register('title', { required: 'Title is required' })}
              placeholder="Project title" className={inputCls} />
          </Field>

          <Field label="Description" error={errors.description?.message}>
            <textarea {...register('description', { required: 'Description is required' })}
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
                    <FiX size={15} />
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => addDetail({ value: '' })}
                className="text-xs text-yellow-400 hover:text-yellow-300 flex items-center gap-1 bg-transparent">
                <FiPlus size={12} /> Add bullet point
              </button>
            </div>
          </Field>

          {/* Tech stack */}
          <Field label="Tech Stack">
            <div className="space-y-3">
              {techFields.map((f, i) => (
                <div key={f.id} className="p-3 rounded-lg bg-white/5 border border-white/10 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500">Tool #{i + 1}</span>
                    <button type="button" onClick={() => removeTech(i)}
                      className="text-gray-500 hover:text-red-400 bg-transparent">
                      <FiX size={13} />
                    </button>
                  </div>
                  <input {...register(`techStack.${i}.name`)}
                    placeholder="Name (e.g. Docker)" className={inputCls} />
                  <div className="flex gap-2 items-center">
                    <input {...register(`techStack.${i}.logoUrl`)}
                      placeholder="Logo URL (paste or upload →)" className={inputCls} />
                    <ImageUploader
                      folder="portfolio/logos"
                      label="Upload"
                      accept="image/*,.svg"
                      preview={watch(`techStack.${i}.logoUrl`)}
                      onUpload={(url, pid) => {
                        setValue(`techStack.${i}.logoUrl`, url);
                      }}
                    />
                  </div>
                </div>
              ))}
              <button type="button" onClick={() => addTech({ name: '', logoUrl: '' })}
                className="text-xs text-yellow-400 hover:text-yellow-300 flex items-center gap-1 bg-transparent">
                <FiPlus size={12} /> Add tech
              </button>
            </div>
          </Field>

          {/* Links */}
          <Field label="GitHub URL">
            <input {...register('links.github')}
              placeholder="https://github.com/…" className={inputCls} />
          </Field>
          <Field label="Live URL">
            <input {...register('links.live')}
              placeholder="https://…" className={inputCls} />
          </Field>
          <Field label="YouTube URL">
            <input {...register('links.youtube')}
              placeholder="https://youtu.be/…" className={inputCls} />
          </Field>

          {/* Cover image */}
          <Field label="Cover Image (optional)">
            <ImageUploader
              folder="portfolio/projects"
              label="Upload Cover"
              accept="image/*"
              preview={coverUrl}
              onUpload={(url, pid) => {
                setValue('coverImage', url);
                setValue('coverImagePublicId', pid);
              }}
            />
          </Field>

          <div className="flex gap-4 items-end">
            <Field label="Display Order">
              <input {...register('order', { valueAsNumber: true })}
                type="number" placeholder="0" className={`${inputCls} w-24`} />
            </Field>
            <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer pb-2.5">
              <input {...register('featured')} type="checkbox" className="accent-yellow-400 w-4 h-4" />
              Featured
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={isSubmitting}
              className="flex-1 py-2.5 rounded-lg bg-yellow-400 text-black font-bold
                hover:bg-yellow-300 transition disabled:opacity-60 disabled:cursor-not-allowed">
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