export function rangeContains(a, time) {
    return (time > a.start) && (time < a.end);
}

export function rangesIntersect(a, b) {
    let aContains = rangeContains(a, b.start) || rangeContains(a, b.end);
    let bContains = rangeContains(b, a.start) || rangeContains(a, a.end);
    return aContains || bContains;
}