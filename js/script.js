// DOM Elements
const display = document.querySelector("#display");
const history = document.querySelector("#history");
const buttons = document.querySelectorAll("button");
const themeToggleBtn = document.querySelector(".theme-toggler");
const calculator = document.querySelector(".calculator");
const toggleIcon = document.querySelector(".toggler-icon");
const currentYearElement = document.getElementById("current-year");

// Set current year in footer
currentYearElement.textContent = new Date().getFullYear();

// Calculator state
let memoryValue = 0;
let lastCalculation = "";
let isDark = localStorage.getItem("calculatorTheme") === "light" ? false : true;

// Initialize theme based on saved preference
function initTheme() {
  if (!isDark) {
    calculator.classList.remove("dark");
    themeToggleBtn.classList.remove("active");
  } else {
    calculator.classList.add("dark");
    themeToggleBtn.classList.add("active");
  }
}

// Safe evaluation function to replace eval
function safeEval(expression) {
  try {
    // Replace all instances of × with * and ÷ with /
    expression = expression.replace(/×/g, "*").replace(/÷/g, "/");

    // Use Function constructor instead of eval for better security
    // This still has security implications but is safer than direct eval
    return new Function("return " + expression)();
  } catch (error) {
    return "Error";
  }
}

// Add calculation to history
function addToHistory(calculation, result) {
  lastCalculation = `${calculation} = ${result}`;
  history.innerText = lastCalculation;
}

// Handle button clicks
buttons.forEach((item) => {
  item.onclick = () => {
    // Memory functions
    if (item.id === "mc") {
      memoryValue = 0;
      return;
    } else if (item.id === "mr") {
      display.innerText += memoryValue;
      return;
    } else if (item.id === "m-plus") {
      if (display.innerText) {
        try {
          memoryValue += safeEval(display.innerText);
        } catch (e) {
          // If there's an error, don't change memory
        }
      }
      return;
    } else if (item.id === "m-minus") {
      if (display.innerText) {
        try {
          memoryValue -= safeEval(display.innerText);
        } catch (e) {
          // If there's an error, don't change memory
        }
      }
      return;
    }

    // Regular calculator functions
    if (item.id === "clear") {
      display.innerText = "";
      history.innerText = "";
    } else if (item.id === "backspace") {
      let string = display.innerText.toString();
      display.innerText = string.substring(0, string.length - 1);
    } else if (display.innerText !== "" && item.id === "equal") {
      const calculation = display.innerText;
      const result = safeEval(calculation);

      if (result !== "Error") {
        addToHistory(calculation, result);
        display.innerText = result;
      } else {
        display.innerText = "Error";
        setTimeout(() => (display.innerText = ""), 2000);
      }
    } else if (display.innerText === "" && item.id === "equal") {
      display.innerText = "Empty!";
      setTimeout(() => (display.innerText = ""), 2000);
    } else {
      display.innerText += item.id;
    }
  };
});

// Theme toggle
themeToggleBtn.onclick = () => {
  calculator.classList.toggle("dark");
  themeToggleBtn.classList.toggle("active");
  isDark = !isDark;
  localStorage.setItem("calculatorTheme", isDark ? "dark" : "light");
};

// Keyboard support
document.addEventListener("keydown", (event) => {
  const key = event.key;

  // Number keys
  if (/^[0-9]$/.test(key)) {
    display.innerText += key;
  }

  // Operators
  if (["+", "-", "*", "/", "(", ")", "."].includes(key)) {
    display.innerText += key;
  }

  // Enter key for equals
  if (key === "Enter") {
    const calculation = display.innerText;
    if (calculation) {
      const result = safeEval(calculation);
      if (result !== "Error") {
        addToHistory(calculation, result);
        display.innerText = result;
      } else {
        display.innerText = "Error";
        setTimeout(() => (display.innerText = ""), 2000);
      }
    }
  }

  // Backspace
  if (key === "Backspace") {
    let string = display.innerText.toString();
    display.innerText = string.substring(0, string.length - 1);
  }

  // Escape for clear
  if (key === "Escape") {
    display.innerText = "";
    history.innerText = "";
  }
});

// 3D tilt effect
function init3DTiltEffect() {
  const calculatorElement = document.querySelector(".calculator");
  const container = document.querySelector(".container");

  // Maximum rotation angle
  const maxRotation = 10;

  // Add event listener for mouse movement
  container.addEventListener("mousemove", (e) => {
    // Get container dimensions and mouse position
    const containerRect = container.getBoundingClientRect();
    const calculatorRect = calculatorElement.getBoundingClientRect();

    // Calculate the center of the calculator
    const calculatorCenterX = calculatorRect.left + calculatorRect.width / 2;
    const calculatorCenterY = calculatorRect.top + calculatorRect.height / 2;

    // Calculate the mouse position relative to the center of the calculator
    const mouseX = e.clientX - calculatorCenterX;
    const mouseY = e.clientY - calculatorCenterY;

    // Calculate rotation angles based on mouse position
    // Divide by a factor to reduce sensitivity
    const rotateY = (mouseX / (containerRect.width / 4)) * maxRotation;
    const rotateX = -(mouseY / (containerRect.height / 4)) * maxRotation;

    // Apply the rotation transform
    calculatorElement.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  // Reset rotation when mouse leaves the container
  container.addEventListener("mouseleave", () => {
    calculatorElement.style.transform = "rotateX(10deg) rotateY(0deg)";
  });

  // Reset rotation when mouse enters the container (smooth transition)
  container.addEventListener("mouseenter", () => {
    calculatorElement.style.transition = "transform 0.3s ease";
    setTimeout(() => {
      calculatorElement.style.transition = "transform 0.1s ease";
    }, 300);
  });
}

// Initialize the calculator
initTheme();
init3DTiltEffect();
