export type AnalysisIntent = {
    analysis_type: "aggregation" | "filter" | "sort" | "trend" | "raw";
    chart: "bar" | "line" | "pie" | "none";
    x_axis: string;
    y_axis: string;
    group_by?: string;
    aggregation_function?: "sum" | "avg" | "count" | "min" | "max";
    filter_column?: string;
    filter_value?: string;
    filter_operator?: "equals" | "greater_than" | "less_than" | "contains";
    sort_by?: string;
    sort_order?: "asc" | "desc";
    limit?: number;
};

export function analyzeData(data: Record<string, unknown>[], intent: AnalysisIntent): Record<string, unknown>[] {
    let processedData = [...data];

    // 1. Filter
    if (intent.filter_column && intent.filter_value && intent.filter_operator) {
        const { filter_column, filter_value, filter_operator } = intent;
        processedData = processedData.filter(row => {
            const val = row[filter_column];
            if (val === undefined || val === null) return false;

            switch (filter_operator) {
                case "equals":
                    return String(val).toLowerCase() === String(filter_value).toLowerCase();
                case "greater_than":
                    return Number(val) > Number(filter_value);
                case "less_than":
                    return Number(val) < Number(filter_value);
                case "contains":
                    return String(val).toLowerCase().includes(String(filter_value).toLowerCase());
                default:
                    return true;
            }
        });
    }

    // 2. Group & Aggregate
    if (intent.group_by && intent.aggregation_function && intent.y_axis) {
        const { group_by, aggregation_function, y_axis } = intent;
        const groups: Record<string, Record<string, unknown>[]> = {};

        processedData.forEach(row => {
            const groupKey = String(row[group_by] || 'Unknown');
            if (!groups[groupKey]) groups[groupKey] = [];
            groups[groupKey].push(row);
        });

        processedData = Object.entries(groups).map(([key, rows]) => {
            let aggregatedValue = 0;
            const validRows = rows.filter(r => {
                const val = r[y_axis];
                return typeof val === 'number' && !isNaN(val);
            });

            switch (aggregation_function) {
                case "sum":
                    aggregatedValue = validRows.reduce((acc, r) => acc + Number(r[y_axis]), 0);
                    break;
                case "avg":
                    aggregatedValue = validRows.length ? validRows.reduce((acc, r) => acc + Number(r[y_axis]), 0) / validRows.length : 0;
                    break;
                case "count":
                    aggregatedValue = rows.length;
                    break;
                case "max":
                    aggregatedValue = validRows.length ? Math.max(...validRows.map(r => Number(r[y_axis]))) : 0;
                    break;
                case "min":
                    aggregatedValue = validRows.length ? Math.min(...validRows.map(r => Number(r[y_axis]))) : 0;
                    break;
            }

            return {
                [group_by]: key,
                [y_axis]: Number(aggregatedValue.toFixed(2)) // Keep it clean for charts
            };
        });
    }

    // 3. Sort
    if (intent.sort_by) {
        const { sort_by, sort_order = "desc" } = intent;
        processedData.sort((a, b) => {
            const valA = a[sort_by];
            const valB = b[sort_by];

            if (typeof valA === 'number' && typeof valB === 'number') {
                return sort_order === "asc" ? valA - valB : valB - valA;
            }
            return sort_order === "asc"
                ? String(valA).localeCompare(String(valB))
                : String(valB).localeCompare(String(valA));
        });
    }

    // 4. Limit
    if (intent.limit && intent.limit > 0) {
        processedData = processedData.slice(0, intent.limit);
    }

    return processedData;
}
