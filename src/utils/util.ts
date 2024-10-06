import {GetProp, UploadProps} from "antd";

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

export const trimText = (text: string | number, removeAll = false): string | number => {
    if (!text) {
        return text;
    }
    if (removeAll) {
        return text.toString().replace(/\s+/g, '').trim();
    } else {
        return text.toString().replace(/ +/g, ' ').trim();
    }
}

export const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });