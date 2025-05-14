class Calculator {
  constructor(previousOperandElement, currentOperandElement) {
    this.previousOperandElement = previousOperandElement
    this.currentOperandElement = currentOperandElement
    this.clear()
  }

  clear() {
    this.currentOperand = "0"
    this.previousOperand = ""
    this.operation = undefined
  }

  delete() {
    if (this.currentOperand === "0") return
    this.currentOperand = this.currentOperand.toString().slice(0, -1)
    if (this.currentOperand === "") {
      this.currentOperand = "0"
    }
  }

  appendNumber(number) {
    if (number === "." && this.currentOperand.includes(".")) return
    if (this.currentOperand === "0" && number !== ".") {
      this.currentOperand = number
    } else {
      this.currentOperand = this.currentOperand.toString() + number
    }
  }

  chooseOperation(operation) {
    if (this.currentOperand === "0" && operation === "-") {
      this.currentOperand = "-"
      return
    }

    if (this.currentOperand === "") return

    if (this.previousOperand !== "") {
      this.compute()
    }

    this.operation = operation
    this.previousOperand = this.currentOperand
    this.currentOperand = "0"
  }

  compute() {
    let computation
    const prev = Number.parseFloat(this.previousOperand)
    const current = Number.parseFloat(this.currentOperand)

    if (isNaN(prev) || isNaN(current)) return

    switch (this.operation) {
      case "+":
        computation = prev + current
        break
      case "-":
        computation = prev - current
        break
      case "*":
        computation = prev * current
        break
      case "/":
        if (current === 0) {
          this.currentOperand = "Erro"
          this.previousOperand = ""
          this.operation = undefined
          return
        }
        computation = prev / current
        break
      case "%":
        computation = (prev * current) / 100
        break
      default:
        return
    }

    this.currentOperand = computation.toString()
    this.operation = undefined
    this.previousOperand = ""
  }

  getDisplayNumber(number) {
    if (number === "Erro") return "Erro"

    const stringNumber = number.toString()
    const integerDigits = Number.parseFloat(stringNumber.split(".")[0])
    const decimalDigits = stringNumber.split(".")[1]

    let integerDisplay

    if (isNaN(integerDigits)) {
      integerDisplay = ""
    } else {
      integerDisplay = integerDigits.toLocaleString("pt-BR", {
        maximumFractionDigits: 0,
      })
    }

    if (decimalDigits != null) {
      return `${integerDisplay},${decimalDigits}`
    } else {
      return integerDisplay
    }
  }

  updateDisplay() {
    this.currentOperandElement.innerText = this.getDisplayNumber(this.currentOperand)

    if (this.operation != null) {
      this.previousOperandElement.innerText = `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`
    } else {
      this.previousOperandElement.innerText = ""
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const previousOperandElement = document.getElementById("previous-operand")
  const currentOperandElement = document.getElementById("current-operand")
  const calculator = new Calculator(previousOperandElement, currentOperandElement)

  // Event listeners for number buttons
  document.querySelectorAll("[data-number]").forEach((button) => {
    button.addEventListener("click", () => {
      calculator.appendNumber(button.getAttribute("data-number"))
      calculator.updateDisplay()
    })
  })

  // Event listeners for operation buttons
  document.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.getAttribute("data-action")

      switch (action) {
        case "clear":
          calculator.clear()
          break
        case "delete":
          calculator.delete()
          break
        case "=":
          calculator.compute()
          break
        case "+":
        case "-":
        case "*":
        case "/":
        case "%":
          calculator.chooseOperation(action)
          break
        default:
          return
      }

      calculator.updateDisplay()
    })
  })

  // Keyboard support
  document.addEventListener("keydown", (event) => {
    if (/[0-9]/.test(event.key)) {
      calculator.appendNumber(event.key)
    } else if (event.key === ".") {
      calculator.appendNumber(".")
    } else if (event.key === "+" || event.key === "-" || event.key === "*" || event.key === "/" || event.key === "%") {
      calculator.chooseOperation(event.key)
    } else if (event.key === "Enter" || event.key === "=") {
      event.preventDefault()
      calculator.compute()
    } else if (event.key === "Backspace") {
      calculator.delete()
    } else if (event.key === "Escape") {
      calculator.clear()
    }

    calculator.updateDisplay()
  })

  // Initialize display
  calculator.updateDisplay()
})
