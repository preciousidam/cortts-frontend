import { Directory, File, Paths } from 'expo-file-system/next';

export const downloadFile = async (filePath: string, filename: string) => {
  const destination = new Directory(Paths.dirname('downloads'), 'pdfs');
  console.log(destination);
  
  try {
    destination.create();
    const output = await File.downloadFileAsync(filePath, destination);
    console.log(output.exists); // true
    console.log(output.uri); // path to the downloaded file, e.g. '${cacheDirectory}/pdfs/sample.pdf'
  } catch (error) {
    console.error(error);
  }
}