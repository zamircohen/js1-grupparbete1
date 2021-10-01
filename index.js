/*
Frontend 1 - Javascript // Nackademin // Group task - Coffeeshop
    
    @author Mattias Söderberg
    @author Hanna Tylna  
    @author Zamir Cohen
    @author Kubilay Demirkiran

*******************************************************************/

// Creates a constant array named "coffees". The array has 3 objects with the elements "name" and "price" with assigned values.
const coffees = [
    { name: "Bryggkaffe", price: 20 },
    { name: "Cappucino", price: 30 },
    { name: "Latte", price: 40 },
]

// Creates a class named "Customer". 
class Customer {
    constructor() {
        this.transactions = []                          // Creates an array which contains the each transaction value
        this.boughtCups = 0                             // Creates an property within the object to keep track of amount bought cups
        this.silverThreshold = 10                       // Creates an property with the threshold for Silver membership set to 10
        this.goldThreshold = 30                         // Creates an property with the threshold for Gold membership set to 30
        this.smallDiscountThreshold = 500               // Creates an property with the threshold for small discount at 500
        this.largeDiscountThreshold = 1000              // Creates an property with the threshold for big discount at 1000
    }

    // A method that adds the transactions 
    addTransaction(transactionObject) {
        this.transactions.push(transactionObject)       // Adds the last made transaction in to the array "transactions"
        this.boughtCups += transactionObject.amount     
    }

    // A method that calculates total spent 
    getTotalSpent() {
        let sum = 0
        this.transactions.forEach(transaction => {
            sum += transaction.total
        })
        return sum
    }

    // A method that finds and returns the current membershipstatus.
    getMembershipStatus() {
        let status = "Brons"

        if (this.boughtCups >= this.silverThreshold && this.boughtCups < this.goldThreshold) {
            status = "Silver"
        } else if (this.boughtCups >= this.goldThreshold) {
            status = "Guld"
        }
        return status
    }

    // A method to find if customer is eligible for a discount.
    getDiscount(pricePerCup) {
        let discount = 1

        if(this.getTotalSpent() + pricePerCup >= this.smallDiscountThreshold && this.getTotalSpent() + pricePerCup < this.largeDiscountThreshold) {
            discount = 0.9
        } else if(this.getTotalSpent() + pricePerCup >= this.largeDiscountThreshold) {
            discount = 0.85
        }
        return discount
    }

    // A method to get the latest transaction from the array "transactions"
    getLatestTransaction() {
        return this.transactions[this.transactions.length - 1]
    }

    // A method that updates the messages on the screen.   
    updateMessage() {
        const totalSpentParagraph = document.getElementById("totalSpent")                   
        const membershipParagraph = document.getElementById("membershipStatus")

        totalSpentParagraph.innerHTML = `Du har handlat för ${this.getTotalSpent()} kr`
        membershipParagraph.innerHTML = `Medlemskapsstatus: ${this.getMembershipStatus()}`
    }

    // A method that creates and updates the transaction messages 
    updateTransactionList() {
        const transactionList = document.getElementById("transactions")
        const transaction = this.getLatestTransaction()
        const header = document.getElementById("transactionHeader")
        header.innerHTML = "Dina transaktioner"
        
        const paragraph = document.createElement("p")                           //create a paragraph element

        paragraph.innerHTML = `Du köpte ${transaction.amount} st ${transaction.name} för ${transaction.price} kr styck. Summa: ${transaction.total}`

        transactionList.prepend(paragraph)
    }
}


// Creates all the constants that are needed
const customer = new Customer()

const button = document.getElementById("buyBtn")
const inputElement = document.getElementById("amountOfCups")                    // A constant for the type of coffee chosen by the user
const selectElement = document.getElementById("coffeeType")                     // A constant for the amount of coffee chosen by the user
const errorMessage = document.getElementById("errorMessage")                    // A constant with an error message if wrong amount of coffee is chosen by the user

coffees.forEach((coffee, index) => {
    selectElement.options.add(
        new Option(`${coffee.name} - ${coffee.price} kr`, index)
    )
})

//Creates an Eventlistener 
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