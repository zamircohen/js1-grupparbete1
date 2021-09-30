const coffees = [
    { name: "Bryggkaffe", price: 20 },
    { name: "Cappucino", price: 30 },
    { name: "Latte", price: 40 },
    { name: "Chai Latte", price: 50 }
]

class Customer {
    constructor() {
        this.transactions = []
        this.boughtCups = 0
        this.silverThreshold = 10
        this.goldThreshold = 30
        this.smallDiscountThreshold = 500
        this.largeDiscountThreshold = 1000
    }
    addTransaction(transactionObject) {
        this.transactions.push(transactionObject)
        this.boughtCups += transactionObject.amount
    }
    getTotalSpent() {
        let sum = 0
        this.transactions.forEach(transaction => {
            sum += transaction.total
        })
        return sum
    }
    getMembershipStatus() {
        let status = "Brons"

        if (this.boughtCups >= this.silverThreshold && this.boughtCups < this.goldThreshold) {
            status = "Silver"
        } else if (this.boughtCups >= this.goldThreshold) {
            status = "Guld"
        }
        return status
    }
    getDiscount(pricePerCup) {
        let discount = 1

        if(this.getTotalSpent() + pricePerCup >= this.smallDiscountThreshold && this.getTotalSpent() + pricePerCup < this.largeDiscountThreshold) {
            discount = 0.9
        } else if(this.getTotalSpent() + pricePerCup >= this.largeDiscountThreshold) {
            discount = 0.85
        }
        return discount
    }
    getLatestTransaction() {
        return this.transactions[this.transactions.length - 1]
    }
    updateMessage() {
        const totalSpentParagraph = document.getElementById("totalSpent")
        const membershipParagraph = document.getElementById("membershipStatus")

        totalSpentParagraph.innerHTML = `Du har handlat för ${this.getTotalSpent()} kr`
        membershipParagraph.innerHTML = `Medlemskapsstatus: ${this.getMembershipStatus()}`
    }
    updateTransactionList() {
        const transactionList = document.getElementById("transactions")
        const transaction = this.getLatestTransaction()
        const header = document.getElementById("transactionHeader")
        header.innerHTML = "Dina transaktioner"
        //create a paragraph element
        const paragraph = document.createElement("p")

        paragraph.innerHTML = `Du köpte ${transaction.amount} st ${transaction.name} för ${transaction.price} kr styck. Summa: ${transaction.total}`

        transactionList.prepend(paragraph)
    }
}

const customer = new Customer()

const button = document.getElementById("buyBtn")
const inputElement = document.getElementById("amountOfCups")
const selectElement = document.getElementById("coffeeType")
const errorMessage = document.getElementById("errorMessage")

coffees.forEach((coffee, index) => {
    selectElement.options.add(
        new Option(`${coffee.name} - ${coffee.price} kr`, index)
    )
})

button.addEventListener("click", () => {
    const name = coffees[selectElement.value].name
    const amount = parseInt(inputElement.value)
    const price = coffees[selectElement.value].price
    let total = 0

    errorMessage.innerHTML = ""

    for(let i = 0; i < amount; i++) {
        total += price * customer.getDiscount(total)
    }

    if (amount >= 1 && amount <= 10) {
        customer.addTransaction({ name: name, amount: amount, price: price, total: total })
        customer.updateMessage()
        customer.updateTransactionList()
    } else if(amount > 10) {
        errorMessage.innerHTML = "Du får inte beställa så mycket kaffe"
    }
})