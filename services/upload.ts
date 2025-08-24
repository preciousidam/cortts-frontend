import { mutationFn } from "@/store/query";
import { MediaFile } from "@/types/models";
import { Platform } from "react-native";
import * as mime from 'react-native-mime-types';

export type FileLike = string | Blob | File;
const isBlob = (f: unknown): f is Blob =>
  typeof globalThis.Blob !== 'undefined' && f instanceof globalThis.Blob;

const isFile = (f: unknown): f is File =>
  typeof globalThis.File !== 'undefined' && f instanceof globalThis.File;

const stringtoBlob = (uri: string): Promise<Blob> => {
  const res = fetch(uri);
  return res.then((response) => response.blob());
};

export const createFormData = async (file: FileLike | FileLike[], additionalData?: Record<string, any>): Promise<FormData> => {
  const formData = new FormData();
  if (additionalData) {
    console.log('additional data', additionalData);
    Object.entries(additionalData).forEach(([key, value]) => {
      formData.append(key, value);
    });
  }

  const getDataToAppend = async (f: string): Promise<{ uri: string; name: string; type: string } | Blob> => {
    if (Platform.OS === 'web') {
      const blob = await stringtoBlob(f);
      return blob;
    }

    const name = f.split('/').pop() || 'upload.bin';
    const type = mime.lookup(name) || 'application/octet-stream';
    return { uri: f, name, type };
  }

  if (Array.isArray(file)) {
    if (file.every((f) => isBlob(f) || isFile(f))) {
      for (const f of file) {
        const fileName = isFile(f) ? f.name : 'file';
        const mimeType = isFile(f) ? mime.lookup(f.name) || 'application/octet-stream' : 'application/octet-stream';
        formData.append('files', f, fileName);
      }
    } else if (file.every((f) => typeof f === 'string')) {
      for (const uri of file) {
        const data = await getDataToAppend(uri);
        const name = uri.split('/').pop() || 'upload.bin';
        const type = mime.lookup(name) || 'application/octet-stream';
        formData.append('files', data as any, name);
      }
    } else {
      throw new Error('Invalid file array');
    }
  } else if (isBlob(file) || isFile(file)) {
    const fileName = isFile(file) ? file.name : 'file';
    const mimeType = isFile(file) ? mime.lookup(file.name) || 'application/octet-stream' : 'application/octet-stream';
    formData.append('file', file, fileName);
  } else if (typeof file === 'string') {
    const uri = file;
    const name = uri.split('/').pop() || 'upload.bin';
    const type = mime.lookup(name) || 'application/octet-stream';
    formData.append('file', { uri, name, type } as any, name);
  }

  return formData;
}

export const uploadFile = async (file: FileLike, extra?: Record<string, any>) => {
  console.log(file, extra);
  
  const formData = await createFormData(file, extra);

  return mutationFn<MediaFile>({
    url: 'upload/upload-media/',
    method: 'post',
    data: formData,
  });
};

  export const uploadFiles = async (files: FileLike[], extra?: Record<string, any>) => {
  const formData = await createFormData(files, extra);

  return mutationFn<MediaFile[]>({
    url: 'upload/upload-multiple-media/',
    method: 'post',
    data: formData,
  });
}