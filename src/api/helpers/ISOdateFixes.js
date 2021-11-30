export function ISOdateFixes(date) {
    return date
        .replace(' ', '')
        .replace(/[A-Z]/g, ' ')
        .split('.')[0];
}