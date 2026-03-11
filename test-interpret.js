import { interpretQuery } from "./lib/gemini.ts";
import "dotenv/config";

async function run() {
    try {
        const datasetMeta = {
            filename: "sales.csv",
            headers: ["Date", "Region", "Sales"],
            sampleData: [{"Date": "2023-01-01", "Region": "North", "Sales": 100}]
        };
        const res = await interpretQuery("What are the total sales by region?", datasetMeta);
        console.log(res);
    } catch(e) {
        console.error(e);
    }
}
run();
