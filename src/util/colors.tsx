export function selectColor(num: number) {
    const hue = num * 137.508; // use golden angle approximation
    return `hsl(${hue},50%,75%)`;
}
