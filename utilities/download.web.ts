import api from '@/libs/api';
import fileDownload from 'js-file-download';

export const downloadFile = async (filePath: string, fileName: string) => {
  try {
    const res = await api.get(filePath, {
      responseType: 'blob',
      headers: { Accept: 'application/octet-stream' },
    });

    fileDownload(res.data, fileName);
  } catch (error) {
    console.error(error);
  }
}