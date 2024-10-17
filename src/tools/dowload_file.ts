import jsFileDownload from 'js-file-download';

export const downloadFile = (
    data: string | ArrayBuffer | ArrayBufferView | Blob,
    filename: string,
) => {
    jsFileDownload(data, filename);
};
