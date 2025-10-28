import * as v from 'valibot';
import { getTranslations } from './translations';

const t = getTranslations();

let fileValidation: v.BaseSchema;
// Run this only on the client
if (typeof File !== 'undefined') {
  fileValidation = v.instance(File, t.validations.required, [
    v.mimeType(
      [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'image/png',
        'image/jpeg',
      ],
      t.validations.invalidFileType
    ),
    v.maxSize(1024 * 1024 * 5, t.validations.fileTooLarge),
  ]);
}

export const isValidFile = () => fileValidation;

export const isValidFiles = () => v.array(fileValidation, [v.minLength(1, t.validations.required)]);

export const isValidString = () => v.string([v.minLength(1, t.validations.required)]);

export const isValidBooleanString = () =>
  v.string(t.validations.required, [v.minLength(1, t.validations.required)]);

export const isValidEmail = () => v.string([v.email(t.validations.invalidEmail)]);

export const isValidPhone = () => v.string([v.minLength(5, t.validations.required)]);

export const isValidArrayString = () =>
  v.array(isValidString(), [v.minLength(1, t.validations.required)]);

export const isTrue = () => v.literal(true, t.validations.required);

export const validators = {
  isValidBooleanString,
  isValidEmail,
  isValidFile,
  isValidFiles,
  isValidPhone,
  isValidString,
  isValidArrayString,
  isTrue,
};
