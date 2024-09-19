export const qs = (object: object): string => {
    return `?${Object.keys(object as object)
        .map((key) => {
            const value = object[key as keyof object];
            if (value === undefined || value === '') return;
            return `${key}=${value}`;
        })
        .filter(Boolean)
        .join('&')}`;
};
