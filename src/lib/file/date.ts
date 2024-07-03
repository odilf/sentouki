/**
 * A date range.
 *
 * If `start === end` then consider it a single date.
 */
export type DateRange = {
    start: Date;
    end: Date;
} | null;

export function dateRange(start: Date | null, end: Date | null): DateRange {
    if (start === null || end === null) {
        return null;
    }

    return { start, end };
}

export function displayDateRange(dateRange: DateRange): string {
    if (dateRange === null) {
        return "No date";
    }

    // TODO: Make option for this to be the date display lol
    // return first.toLocaleString('en-US', {
    //     dayPeriod: 'long',
    //     era: 'long',
    // })

    const { start, end } = dateRange;

    const y1 = start.getFullYear();
    const y2 = end.getFullYear();

    if (y1 !== y2) {
        if (y2 - y1 < 100) {
            return `${y1}-${y2.toString().slice(-2)}`;
        }

        return `${y1}-${y2}`;
    }

    const m1 = start.toLocaleString("en-US", { month: "short" });
    const m2 = end.toLocaleString("en-US", { month: "short" });

    if (m1 !== m2) {
        return `${m1}-${m2} ${y1}`;
    }

    const d1 = start.getDate().toString().padStart(2, "0");
    const d2 = end.getDate().toString().padStart(2, "0");

    if (d1 !== d2) {
        return `${m1} ${d1}-${d2}, ${y1}`;
    }

    return start.toLocaleString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}
