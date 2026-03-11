import { NextRequest, NextResponse } from "next/server";
import { interpretQuery } from "@/lib/gemini";
import { analyzeData, AnalysisIntent } from "@/lib/dataAnalyzer";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { query, datasetMeta, allRows } = body;

        if (!query || !datasetMeta || !allRows) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // 1. Ask Gemini to interpret the query into an AnalysisIntent
        const intentData = await interpretQuery(query, datasetMeta);

        const intent: AnalysisIntent = {
            analysis_type: intentData.analysis_type,
            chart: intentData.chart,
            x_axis: intentData.x_axis,
            y_axis: intentData.y_axis,
            group_by: intentData.group_by,
            aggregation_function: intentData.aggregation_function,
            filter_column: intentData.filter_column,
            filter_value: intentData.filter_value,
            filter_operator: intentData.filter_operator,
            sort_by: intentData.sort_by,
            sort_order: intentData.sort_order,
            limit: intentData.limit
        };

        // 2. Perform the data processing on the `allRows` dataset
        const processedData = analyzeData(allRows, intent);

        if (!processedData || processedData.length === 0) {
            return NextResponse.json({
                success: true,
                insight: "No matching data found for this query.",
                chartConfig: null,
                processedData: []
            });
        }

        // 3. Format the chart config Response
        const chartConfig = intent.chart !== "none" ? {
            type: intent.chart,
            data: processedData,
            xAxisKey: intent.x_axis || intent.group_by || Object.keys(processedData[0] || {})[0],
            yAxisKey: intent.y_axis || Object.keys(processedData[0] || {}).find(k => typeof processedData[0][k] === 'number'),
            title: intentData.title || `ANALYSIS: ${query.toUpperCase()}`
        } : null;

        return NextResponse.json({
            success: true,
            insight: intentData.insight,
            chartConfig,
            processedData
        });

    } catch (error: unknown) {
        console.error("CRITICAL_API_ERROR:", error);
        if (error instanceof Error) {
            console.error("STACK_TRACE:", error.stack);
        }
        const msg = error instanceof Error ? error.message : "Internal Server Error";
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}
