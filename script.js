const foods = {
"1 tbsp cream cheese": {
  calories: 45,
  protein: 1.0,
  carbs: 1.0,
  sodium: 45,
  potassium: 19
},

"1 tbsp mayonnaise": {
  calories: 90,
  protein: 0.0,
  carbs: 0.0,
  sodium: 90,
  potassium: 0
},

  "1 tbsp olive oil": {
  calories: 119,
  protein: 0.0,
  carbs: 0.0,
  sodium: 0.3,
  potassium: 0.1
},


"pbpowder1serving": {
  calories: 60,
  protein: 7.0,
  carbs: 5.0,
  sodium: 2,
  potassium: 175
},

"small potato": {
  calories: 85,
  protein: 2.2,
  carbs: 19.5,
  sodium: 7,
  potassium: 448
},

 "medium potato": {
  calories: 135,
  protein: 3.6,
  carbs: 31.0,
  sodium: 11,
  potassium: 708
},

 "large potato": {
  calories: 233,
  protein: 7.9,
  carbs: 68.0,
  sodium: 19,
  potassium: 1223
},


"1 cup mixed veggies": {
  calories: 75,
  protein: 3.1,
  carbs: 15.0,
  sodium: 46,
  potassium: 276
},

"1 cup milk": {
  calories: 149,
  protein: 8.0,
  carbs: 12.0,
  sodium: 105,
  potassium: 322
},

  "1 can tuna": {
    calories: 130,
    protein: 28,
    carbs: 0,
    sodium: 300,
    potassium: 250
  },

 "1 egg": {
  calories: 72,
  protein: 6.3,
  carbs: 0.4,
  sodium: 71,
  potassium: 69
},
    
  
   "medium avocado": {
    calories: 240,
    protein: 3,
    carbs: 12,
    sodium: 10,
    potassium: 700
  },

"medium banana": {
  calories: 105,
  protein: 1.3,
  carbs: 27.0,
  sodium: 1.2,
  potassium: 422
},

 "gala apple": {
  calories: 95,
  protein: 0.5,
  carbs: 25.0,
  sodium: 2,
  potassium: 195
},

 "1/4 cup kefir": {
  calories: 28,
  protein: 2.2,
  carbs: 3.0,
  sodium: 31,
  potassium: 95
},

"30g walnuts": {
  calories: 196,
  protein: 4.6,
  carbs: 4.1,
  sodium: 1,
  potassium: 132
},

"30g almonds": {
  calories: 174,
  protein: 6.4,
  carbs: 6.5,
  sodium: 0.3,
  potassium: 219
},

  "1 slice bread": {
    calories: 110,
    protein: 7,
    carbs: 17,
    sodium: 165,
    potassium: 25
  },

"chicken breast": {
  calories: 120,
  protein: 22.5,
  carbs: 0.0,
  sodium: 45,
  potassium: 334
},

"chicken thigh": {
  calories: 121,
  protein: 19.3,
  carbs: 0.0,
  sodium: 85,
  potassium: 262
},

"1/2 cup seasoned minced meat": {
  calories: 156,
  protein: 24.0,
  carbs: 0.0,
  sodium: 78,
  potassium: 358
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
