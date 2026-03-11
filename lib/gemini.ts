import { GoogleGenAI } from "@google/genai";

const getAI = () => {
    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
    return new GoogleGenAI({ apiKey });
};

export async function interpretQuery(
    query: string,
    datasetMeta: { filename: string; headers: string[]; sampleData: Record<string, unknown>[] }
) {
    const prompt = `
You are the AI engine for "Talking Rabbitt", a futuristic conversational business intelligence tool.
A user has uploaded a dataset and asked a question about it.

DATASET METADATA:
- Filename: ${datasetMeta.filename}
- Headers: ${datasetMeta.headers.join(", ")}
- Sample Data (first 3 rows):
${JSON.stringify(datasetMeta.sampleData.slice(0, 3), null, 2)}

USER QUESTION: "${query}"

Your task is to interpret the user's question and map it to an execution plan. The system will process the dataset based on your instructions. 

Determine the best chart type to visualize the answer ("bar", "line", "pie", or "none"). 
Also generate a short, insightful business summary ("insight") pretending you already know the answer based on typical patterns, OR simply state what analysis is being shown (since you don't have the full data, provide a solid contextual insight focusing on the action).

Respond strictly with a JSON object matching this schema:
{
  "analysis_type": "aggregation" | "filter" | "sort" | "trend" | "raw",
  "chart": "bar" | "line" | "pie" | "none",
  "x_axis": "column_name for x axis",
  "y_axis": "column_name for y axis (must be numeric)",
  "group_by": "optional column_name to group by",
  "aggregation_function": "sum" | "avg" | "count" | "min" | "max",
  "filter_column": "optional column to filter on",
  "filter_value": "optional value to filter by",
  "filter_operator": "equals" | "greater_than" | "less_than" | "contains",
  "sort_by": "column to sort by",
  "sort_order": "asc" | "desc",
  "limit": 10,
  "title": "A short cyberpunk-style title for the chart (e.g., REVENUE_DISTRIBUTION_MATRIX)",
  "insight": "A short, punchy sentence explaining the visualization."
}

Ensure returned column names exactly match the spelling/casing in the Headers. Do not include markdown formatting like \`\`\`json in the response. Only the raw JSON object. Use double quotes.
`;

    try {
        const ai = getAI();
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt,
            config: {
                temperature: 0.1,
                responseMimeType: "application/json",
            }
        });

        const text = response.text;
        if (!text) {
            throw new Error("No response from Gemini");
        }

        console.log("RAW_GEMINI_RESPONSE:", text);

        // More robust JSON extraction
        let jsonStr = text;
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            jsonStr = jsonMatch[0];
        }

        try {
            return JSON.parse(jsonStr);
        } catch (parseError) {
            console.error("JSON_PARSE_ERROR:", parseError, "STR:", jsonStr);
            throw new Error("Failed to parse analysis intent from AI response.");
        }

    } catch (error: any) {
        console.error("Gemini interpretation error:", error);

        let message = error.message || "Failed to interpret query.";

        // Handle stringified JSON error from Google SDK
        if (typeof message === 'string' && (message.includes('429') || message.includes('RESOURCE_EXHAUSTED'))) {
            try {
                const parsedError = JSON.parse(message);
                if (parsedError.error?.message) {
                    message = `AI Quota Exhausted: ${parsedError.error.message}`;
                }
            } catch {
                message = "AI service is currently at its free-tier limit. Please wait a minute and try again.";
            }
        }

        throw new Error(message);
    }
}
