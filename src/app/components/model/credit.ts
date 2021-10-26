export class Credit {

    id: number;
    name: string;
    amount: number;
    term: number;
    interest: number;
    monthlyFee: number;

    constructor(id: number, name: string, amount: number,
        term: number, interest: number,
        monthlyFee: number) {
        this.id = id;
        this.name = name;
        this.amount = amount;
        this.term = term;
        this.interest = interest;
        this.monthlyFee = monthlyFee;
    }
}