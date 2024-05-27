export const splitNumber = (n: number): string => {
    const text = `${n}`;
    let format = "";
    let count = 0;
    for (let i = text.length - 1; i >= 0; i--) {
        count++

        if (count === 3 && text[i - 1] !== undefined) {
            format = `.${text[i]}${format}`;
            count = 0;
            continue;
        }
        format = `${text[i]}${format}`
    }

    return format
}