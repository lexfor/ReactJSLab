export function ISOdateFixes(date) {
    return date
        .replace(/[A-Z]/g, ' ')
        .split('.')[0];
}