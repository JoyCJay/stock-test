import { csvTokenizer, precision_bit, StockInfo, StockRecord } from './type';

const fs = require('node:fs');
const readline = require('node:readline');
// const dataSourcePath = 'sample2.csv'
const dataSourcePath = 'values.csv'

async function compute() {
    const stockInfoMap = new Map<String, StockInfo>()
    let maxStockInfoRef = {
        diff: 0
    }

    const rl = readline.createInterface({
        input: fs.createReadStream(dataSourcePath),
    })

    for await (const line of rl) {

        const record = new StockRecord(line.split(csvTokenizer))

        if (!record.isValid) { continue }

        if (!stockInfoMap.has(record.Name)) {
            stockInfoMap.set(record.Name, {
                first: record,
                last: null,
                diff: 0
            })
        }

        const stockInfo = stockInfoMap.get(record.Name)
        if (stockInfo.last === null || stockInfo.last.Date < record.Date) {
            stockInfo.last = record
        }
        stockInfo.first = (record.Date < stockInfo.first.Date)? record : stockInfo.first

        stockInfo.diff = parseFloat((stockInfo.last.Value - stockInfo.first.Value).toFixed(precision_bit))

        maxStockInfoRef = (stockInfo.diff > maxStockInfoRef.diff)? stockInfo : maxStockInfoRef
    }
    return maxStockInfoRef
}

compute().then((s: StockInfo) => {
    // console.log('after stream', s)
    let result = (s.diff > 0)? `公司: ${s.first.Name}, 股价增值: ${s.diff.toFixed(precision_bit)}` : 'nil'
    console.log(result)
});
