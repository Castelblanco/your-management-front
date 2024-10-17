export const getFilenameInDisposition = (name: string) => {
    return name.replace('attachment; filename=', '');
};
