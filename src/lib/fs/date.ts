/**
 * A date range.
 *
 * If `start === end` then consider it a single date.
 */
export type DateRange = {
	first: Date;
	last: Date;
};

export function dateRangeSingle(date: Date) {
	return {
		start: date,
		end: date,
	};
}

export function displayDateRange({ first, last }: DateRange): string {
	// TODO: Make option for this to be the date display lol
	// return first.toLocaleString('en-US', {
	//     dayPeriod: 'long',
	//     era: 'long',
	// })

	const y1 = first.getFullYear();
	const y2 = last.getFullYear();

	if (y1 !== y2) {
		if (y2 - y1 < 100) {
			return `${y1}-${y2.toString().slice(-2)}`;
		}

		return `${y1}-${y2}`;
	}

	const m1 = first.toLocaleString("en-US", { month: "short" });
	const m2 = last.toLocaleString("en-US", { month: "short" });

	if (m1 !== m2) {
		return `${m1}-${m2} ${y1}`;
	}

	const d1 = first.getDate().toString().padStart(2, "0");
	const d2 = last.getDate().toString().padStart(2, "0");

	if (d1 !== d2) {
		return `${m1} ${d1}-${d2}, ${y1}`;
	}

	return first.toLocaleString("en-US", {
		day: "2-digit",
		month: "short",
		year: "numeric",
	});
}
