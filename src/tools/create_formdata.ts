export const createFormData = (data: object): FormData => {
    const formData = new FormData();

    Object.keys(data).forEach((key) => {
        const value = data[key as keyof object];

        if (value === undefined) return;
        if (typeof value === 'string') return formData.append(key, value);
        if (typeof value === 'number') return formData.append(key, `${value}`);
        else return formData.append(key, JSON.stringify(value));
    });

    return formData;
};
