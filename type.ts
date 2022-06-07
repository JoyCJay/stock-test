export const csvTokenizer = ','

export const valableChangeValue = ['NEW', 'INCREASED', 'DECREASED']

export class StockRecord {
    Name: string
    Date: Date
    notes: string
    Value: number
    Change: string // NEW | INCREASED | DECREASED

    isValid = false

    constructor(param: string[]) {
        this.Name = param[0]
        this.Date = new Date(param[1])
        this.notes = param[2]
        this.Value = parseFloat(param[3])
        this.Change = param[4]

        const flag = valableChangeValue.find(s => s === param[4])
        if (flag) {
            this.isValid = true
        }
    }
}

export interface StockInfo {
    first?: StockRecord
    last?: StockRecord
    diff: number
}

export const precision_bit = 6