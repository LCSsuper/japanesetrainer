export const save = (key: string, value: any) => {
    if (value === undefined) {
        window.localStorage.removeItem(key);
        return;
    }
    window.localStorage.setItem(key, JSON.stringify(value));
};

export const get = (key: string) => {
    const item = window.localStorage.getItem(key);
    if (!item) return undefined;
    return JSON.parse(item);
};
