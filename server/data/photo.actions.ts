'use server';
import { z } from 'zod';
import { PhotoInput } from '@/types';
import { requireAdmin } from '../auth';
import { createPhoto, deletePhoto, reorderPhotos, updatePhoto } from './photo';
import { formatZodList } from '@/lib';
import { storeFormImage, storeImageFile, titleFromFileName } from '@/server/media';

/** Shape returned to `useActionState`; `errors` is keyed by form field name */
export type PhotoFormState = {
    /** Field-level validation messages */
    errors?: Record<string, string[]>;
    /** Top-level failure message, shown above the form */
    message?: string;
    /** Id of the record just saved; set only on success */
    savedId?: number;
};

/** Outcome of a one-off action that isn't a form save */
export type PhotoActionResult = { ok: true; id: number } | { ok: false; message: string };

/** Empty inputs become `undefined`, so cleared fields are stored as null */
const optionalText = (max: number) =>
    z
        .string()
        .trim()
        .max(max)
        .default('')
        .transform((value) => value || undefined);

/** Field lengths mirror the `VarChar` limits in the Prisma schema */
const photoSchema = z.object({
    title: z.string().trim().min(1, 'Title is required').max(100),
    caption: optionalText(2000),
    camera: optionalText(100),
    location: optionalText(100),
    takenAt: z
        .string()
        .trim()
        .default('')
        .refine((value) => !value || /^\d{4}-\d{2}-\d{2}$/.test(value), 'Use YYYY-MM-DD')
        .transform((value) => (value ? new Date(`${value}T00:00:00Z`) : undefined)),
    published: z
        .string()
        .default('false')
        .transform((value) => value === 'true'),
    // `Tag.name` is uniquely indexed, so dedupe before the write
    tags: formatZodList(50).transform((names) => [...new Set(names)]),
    imageAlt: z.string().trim().max(255).default(''),
});

type ParseResult = { success: true; data: PhotoInput } | { success: false; state: PhotoFormState };

/** Reads the photo form fields and reshapes them into a `PhotoInput` */
const parsePhotoForm = (formData: FormData): ParseResult => {
    const parsed = photoSchema.safeParse({
        title: formData.get('title'),
        caption: formData.get('caption'),
        camera: formData.get('camera'),
        location: formData.get('location'),
        takenAt: formData.get('takenAt'),
        published: formData.get('published'),
        tags: formData.get('tags'),
        imageAlt: formData.get('imageAlt'),
    });

    if (!parsed.success) {
        return { success: false, state: { errors: z.flattenError(parsed.error).fieldErrors } };
    }

    const { imageAlt, tags, ...rest } = parsed.data;

    return {
        success: true,
        data: {
            ...rest,
            tags: tags.map((name) => ({ name })),
            // `stored` is added by the action once an uploaded file is processed
            image: { alt: imageAlt || rest.title },
        },
    };
};

/**
 * Uploads one photo as an unpublished draft, titled from its file name with camera and date
 * from EXIF. Called once per file so each request stays under the body size limit.
 *
 * @example
 * const formData = new FormData();
 * formData.set('image', file);
 * const result = await uploadPhotoAction(formData);
 */
export const uploadPhotoAction = async (formData: FormData): Promise<PhotoActionResult> => {
    await requireAdmin();

    const file = formData.get('image');
    if (!(file instanceof File) || file.size === 0) return { ok: false, message: 'No file picked' };

    const title = titleFromFileName(file.name);
    const upload = await storeImageFile(file, { folder: 'photo', name: title });
    if (!upload.ok) return { ok: false, message: upload.error };

    try {
        const { camera, takenAt } = upload.exif;
        const photo = await createPhoto({ title, camera, takenAt, stored: upload.stored });
        return { ok: true, id: photo.id };
    } catch (error) {
        // Prisma messages can leak schema details, so log and return generic copy
        console.error('Failed to create photo:', error);
        return { ok: false, message: 'Could not save this photo' };
    }
};

/**
 * Updates an existing Photo. `id` is bound server-side rather than read from
 * the form, so it can't be swapped by the client. A new image file is optional.
 *
 * @example
 * const action = updatePhotoAction.bind(null, photo.id);
 * const [state, formAction, pending] = useActionState(action, {});
 */
export const updatePhotoAction = async (
    id: number,
    prevState: PhotoFormState,
    formData: FormData
): Promise<PhotoFormState> => {
    await requireAdmin();

    const parsed = parsePhotoForm(formData);
    if (!parsed.success) return parsed.state;

    // Optional on update: without a new file the current image is kept
    const { stored, error: imageError } = await storeFormImage(formData, {
        folder: 'photo',
        name: parsed.data.title,
        required: false,
    });
    if (imageError) return { errors: { image: [imageError] } };
    parsed.data.image.stored = stored;

    try {
        await updatePhoto(id, parsed.data);
    } catch (error) {
        console.error('Failed to update photo:', error);
        return { message: 'Could not save this photo. Please try again.' };
    }

    return { savedId: id };
};

/** Deletes a Photo along with its files */
export const deletePhotoAction = async (id: number): Promise<PhotoActionResult> => {
    await requireAdmin();

    try {
        await deletePhoto(id);
        return { ok: true, id };
    } catch (error) {
        console.error('Failed to delete photo:', error);
        return { ok: false, message: 'Could not delete this photo. Please try again.' };
    }
};

/**
 * Saves the page order from the arrange view. The reorderable list submits
 * photo ids as repeated `order` fields, top to bottom.
 */
export const reorderPhotosAction = async (formData: FormData): Promise<PhotoActionResult> => {
    await requireAdmin();

    const ids = z.array(z.coerce.number().int().positive()).safeParse(formData.getAll('order'));
    if (!ids.success) return { ok: false, message: 'Invalid photo order' };

    try {
        await reorderPhotos(ids.data);
        return { ok: true, id: ids.data[0] ?? 0 };
    } catch (error) {
        console.error('Failed to reorder photos:', error);
        return { ok: false, message: 'Could not save the order. Please try again.' };
    }
};
