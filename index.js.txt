const foods = {
  "1 tbsp cream cheese": {
    calories: 90,
    protein: 5,
    carbs: 3,
    sodium: 80,
    potassium: 20
  },

  "1 tbsp mayonnaise": {
    calories: 70,
    protein: 1,
    carbs: 15,
    sodium: 65,
    potassium: 5
  },

  "1 tbsp olive oil": {
    calories: 120,
    protein: 0,
    carbs: 0,
    sodium: 0,
    potassium: 0
  },

  pbpowder1serving: {
    calories: 50,
    protein: 10,
    carbs: 30,
    sodium: 150,
    potassium: 200
  },

  "small potato": {
    calories: 50,
    protein: 10,
    carbs: 30,
    sodium: 5,
    potassium: 425
  },

  "medium potato": {
    calories: 75,
    protein: 15,
    carbs: 45,
    sodium: 7,
    potassium: 620
  },

  "large potato": {
    calories: 100,
    protein: 20,
    carbs: 60,
    sodium: 10,
    potassium: 850
  },

  "1 cup mixed veggies": {
    calories: 40,
    protein: 2,
    carbs: 8,
    sodium: 30,
    potassium: 200
  },

  "1 cup milk": {
    calories: 120,
    protein: 8,
    carbs: 12,
    sodium: 120,
    potassium: 350
  },

  "1 can tuna": {
    calories: 130,
    protein: 28,
    carbs: 0,
    sodium: 300,
    potassium: 250
  },

  "1 egg": {
    calories: 70,
    protein: 6,
    carbs: 1,
    sodium: 70,
    potassium: 70
  }
};

let days = [];
let currentMeal = 0;
let deleteIndex = null;
let currentDayIndex = 0;

function saveToStorage() {
  localStorage.setItem("days", JSON.stringify(days));
}

function saveDay() {
  const today = new Date();

  const dateLabel = today.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  days.push({
    date: dateLabel,
    collapsed: false, // 🔥 ADD THIS
    meals: [
      {
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit"
        }),
        foods: [],
        calories: 0,
        protein: 0,
        carbs: 0,
        sodium: 0,
        potassium: 0
      }
    ]
  });

  // 🔥 THIS is the missing piece
  currentDayIndex = days.length - 1;
  currentMeal = 0;

  saveToStorage();
  renderDays();
  updateUI();
  updateDayLabel();
}

function toggleDay(index) {
  days[index].collapsed = !days[index].collapsed;
  renderDays();
}

function addMeal() {
  const currentDay = days[currentDayIndex];
  if (!currentDay) return;

  currentDay.meals.push({
    time: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    }),
    foods: [],
    calories: 0,
    protein: 0,
    carbs: 0,
    sodium: 0,
    potassium: 0
  });

  currentMeal = currentDay.meals.length - 1;

  saveToStorage();
  renderDays();
  updateUI();
  updateDayLabel();
}

function updateUI() {
  const currentDay = days[currentDayIndex];

  let cals = 0;
  let protein = 0;
  let carbs = 0;
  let sodium = 0;
  let potassium = 0;

  if (currentDay && currentDay.meals) {
    currentDay.meals.forEach((m) => {
      cals += m.calories || 0;
      protein += m.protein || 0;
      carbs += m.carbs || 0;
      sodium += m.sodium || 0;
      potassium += m.potassium || 0;
    });
  }

  document.getElementById("calories").textContent = cals;
  document.getElementById("protein").textContent = protein;
  document.getElementById("carbs").textContent = carbs;
  document.getElementById("sodium").textContent = sodium;
  document.getElementById("potassium").textContent = potassium;
}

function renderDays() {
  const container = document.getElementById("dayContainer");

  container.innerHTML = "";

  days.forEach((day, index) => {
    let cals = 0;
    let protein = 0;
    let carbs = 0;
    let sodium = 0;
    let potassium = 0;

    day.meals.forEach((m) => {
      cals += m.calories;
      protein += m.protein;
      carbs += m.carbs;
      sodium += m.sodium || 0;
      potassium += m.potassium || 0;
    });

    container.innerHTML += `
      <div class="day-box">

        <h3 style="cursor:pointer" onclick="toggleDay(${index})">
          ${day.date} ${day.collapsed ? "(collapsed)" : ""}
        </h3>

        <p>Cals: ${cals}</p>
        <p>Protein: ${protein}</p>
        <p>Carbs: ${carbs}</p>
        <p>Sodium: ${sodium} mg</p>
        <p>Potassium: ${potassium} mg</p>

        ${
          day.collapsed
            ? ""
            : `
          <div class="meals">
            ${day.meals
              .map(
                (m, i) => `
              <div class="meal">
                <strong>Meal ${i + 1}</strong><br>
                Time: ${m.time}<br>
                ${
                  m.foods?.length
                    ? "Foods: " + m.foods.join(", ")
                    : "Foods: none"
                }<br>
                ${m.calories} cals | ${m.protein}g | ${m.carbs} carbs | ${
                  m.sodium || 0
                }mg sodium | ${m.potassium || 0}mg potassium<br>

                <button onclick="editMealTime(${index}, ${i})">Edit Time</button>
              </div>
            `
              )
              .join("")}
          </div>
        `
        }

        <button onclick="deleteDay(${index})">Delete</button>

      </div>
    `;
  });
}

function editMealTime(dayIndex, mealIndex) {
  const newTime = prompt("Enter new time (e.g. 14:30 or 2:30 PM):");

  if (!newTime) return;

  days[dayIndex].meals[mealIndex].time = newTime;

  saveToStorage();
  renderDays();
}

function clearTotals() {
  const currentDay = days[currentDayIndex];
  if (!currentDay) return;

  const meal = currentDay.meals[currentMeal];
  if (!meal) return;

  currentDay.meals[currentMeal] = {
    time: meal.time,
    foods: [],
    calories: 0,
    protein: 0,
    carbs: 0,
    sodium: 0,
    potassium: 0
  };

  saveToStorage();
  updateUI();
  renderDays();
  updateDayLabel();
}

function deleteDay(index) {
  deleteIndex = index;
  document.getElementById("confirmModal").style.display = "flex";
  currentMeal = 0;
}

function confirmDelete() {
  if (deleteIndex === null) return;

  days.splice(deleteIndex, 1);
  deleteIndex = null;

  saveToStorage();
  renderDays();
  closeModal();
}

function closeModal() {
  document.getElementById("confirmModal").style.display = "none";
  deleteIndex = null;
}

function addFood(foodName) {
  const food = foods[foodName];
  if (!food) return;

  if (days.length === 0) saveDay();

  const currentDay = days[currentDayIndex];
  if (!currentDay || !currentDay.meals) return;

  if (!currentDay.meals[currentMeal]) {
    currentDay.meals[currentMeal] = {
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      }),
      foods: [],
      calories: 0,
      protein: 0,
      carbs: 0,
      sodium: 0,
      potassium: 0
    };
  }

  const meal = currentDay.meals[currentMeal];

  meal.foods.push(foodName);

  meal.calories += food.calories;
  meal.protein += food.protein;
  meal.carbs += food.carbs;

  meal.sodium += food.sodium || 0;
  meal.potassium += food.potassium || 0;

  saveToStorage();
  updateUI();
  renderDays();
  updateDayLabel();
}

function updateDayLabel() {
  const label = document.getElementById("dayLabel");

  if (days.length === 0) {
    label.textContent = "No Day Started";
  } else {
    label.textContent = days[currentDayIndex].date;
  }
}

window.onload = function () {
  const savedDays = localStorage.getItem("days");

  if (savedDays) {
    days = JSON.parse(savedDays);
  }

  currentDayIndex = days.length ? days.length - 1 : 0;
  currentMeal = 0;

  renderDays();
  updateUI();
  updateDayLabel();
};
