import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../config';

export const uploadImageToFirebase = async (
  uri: string,
  name: string,
  dir: string
): Promise<string> => {
  const fetchResponse = await fetch(uri);
  const theBlob = await fetchResponse.blob();

  const imageRef = ref(storage, `${dir}/${name}`);
  const uploadResult = await uploadBytes(imageRef, theBlob);
  const downloadUrl = await getDownloadURL(uploadResult.ref);
  return downloadUrl;
};
