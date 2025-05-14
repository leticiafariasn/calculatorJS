// Selecionando elementos do DOM
const previousOperandElement = document.getElementById("previous-operand")
const currentOperandElement = document.getElementById("current-operand")
const numberButtons = document.querySelectorAll(".number")
const operatorButtons = document.querySelectorAll(".operator")
const equalsButton = document.getElementById("equals")
const clearButton = document.getElementById("clear")
const deleteButton = document.getElementById("delete")
const decimalButton = document.getElementById("decimal")

// Variáveis para armazenar os valores e operações
let currentOperand = "0"
let previousOperand = ""
let operation = undefined
let shouldResetScreen = false

// Funções principais da calculadora
function clear() {
  currentOperand = "0"
  previousOperand = ""
  operation = undefined
}

function deleteNumber() {
  if (currentOperand === "0") return
  if (currentOperand.length === 1 || (currentOperand.length === 2 && currentOperand.startsWith("-"))) {
    currentOperand = "0"
  } else {
    currentOperand = currentOperand.slice(0, -1)
  }
}

function appendNumber(number) {
  if (shouldResetScreen) {
    currentOperand = ""
    shouldResetScreen = false
  }

  if (number === "." && currentOperand.includes(".")) return

  if (currentOperand === "0" && number !== ".") {
    currentOperand = number
  } else {
    currentOperand += number
  }
}

function chooseOperation(op) {
  if (currentOperand === "0" && op === "-") {
    currentOperand = "-"
    return
  }

  if (currentOperand === "") return

  if (previousOperand !== "") {
    compute()
  }

  operation = op
  previousOperand = currentOperand
  shouldResetScreen = true
}

function compute() {
  let computation
  const prev = Number.parseFloat(previousOperand)
  const current = Number.parseFloat(currentOperand)

  if (isNaN(prev) || isNaN(current)) return

  switch (operation) {
    case "+":
      computation = prev + current
      break
    case "-":
      computation = prev - current
      break
    case "×":
      computation = prev * current
      break
    case "/":
      if (current === 0) {
        alert("Erro: Divisão por zero!")
        clear()
        updateDisplay()
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

  currentOperand = computation.toString()
  operation = undefined
  previousOperand = ""
  shouldResetScreen = true
}

function getDisplayNumber(number) {
  const stringNumber = number.toString()
  const integerDigits = Number.parseFloat(stringNumber.split(".")[0])
  const decimalDigits = stringNumber.split(".")[1]

  let integerDisplay

  if (isNaN(integerDigits)) {
    integerDisplay = ""
  } else {
    integerDisplay = integerDigits.toLocaleString("pt-BR", { maximumFractionDigits: 0 })
  }

  if (decimalDigits != null) {
    return `${integerDisplay},${decimalDigits}`
  } else {
    return integerDisplay
  }
}

function updateDisplay() {
  currentOperandElement.textContent = getDisplayNumber(currentOperand)

  if (operation != null) {
    previousOperandElement.textContent = `${getDisplayNumber(previousOperand)} ${operation}`
  } else {
    previousOperandElement.textContent = ""
  }
}

// Event Listeners
numberButtons.forEach((button) => {
  button.addEventListener("click", () => {
    appendNumber(button.textContent)
    updateDisplay()
  })
})

operatorButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (button.id === "clear") {
      clear()
    } else if (button.id === "delete") {
      deleteNumber()
    } else if (button.id === "percentage") {
      chooseOperation("%")
    } else if (button.id === "divide") {
      chooseOperation("/")
    } else if (button.id === "multiply") {
      chooseOperation("×")
    } else if (button.id === "subtract") {
      chooseOperation("-")
    } else if (button.id === "add") {
      chooseOperation("+")
    }
    updateDisplay()
  })
})

equalsButton.addEventListener("click", () => {
  compute()
  updateDisplay()
})

// Suporte para teclado
document.addEventListener("keydown", (event) => {
  if (/[0-9]/.test(event.key)) {
    appendNumber(event.key)
    updateDisplay()
  } else if (event.key === ".") {
    appendNumber(".")
    updateDisplay()
  } else if (event.key === "+") {
    chooseOperation("+")
    updateDisplay()
  } else if (event.key === "-") {
    chooseOperation("-")
    updateDisplay()
  } else if (event.key === "*") {
    chooseOperation("×")
    updateDisplay()
  } else if (event.key === "/") {
    event.preventDefault() // Previne o quick find no Firefox
    chooseOperation("/")
    updateDisplay()
  } else if (event.key === "%") {
    chooseOperation("%")
    updateDisplay()
  } else if (event.key === "Enter" || event.key === "=") {
    event.preventDefault()
    compute()
    updateDisplay()
  } else if (event.key === "Backspace") {
    deleteNumber()
    updateDisplay()
  } else if (event.key === "Escape") {
    clear()
    updateDisplay()
  }
})

// Inicialização
clear()
updateDisplay()
