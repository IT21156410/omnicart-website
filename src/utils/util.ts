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
