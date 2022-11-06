// fetch data with .then and .catch 
// const goal = () => {
//    fetch('../data')
//       .then(res => res.json())
//       .then(function (user) {
//          let currentUser = user;
//          // console.log(currentUser);
//          updateName(currentUser.name);
//          updatePet(currentUser.pet);
//          updateWater(currentUser.drank, currentUser.goal);
//       })
//       .catch(function (monkeyerror) {
//          console.log(monkeyerror)
//       })
// }

// goal();

// fetch data with async and await function
const goal = async () => {
   try {
      const data = await fetch('../data');
      // console.log(data)
      const currentUser = await data.json();
      console.log(currentUser);
      updateName(currentUser.name);
      updatePet(currentUser.pet_type);
      updateFavicon(currentUser.pet_type)
      updateWater(currentUser.water_drank, currentUser.water_goal);
      // using test array to visualize  history as not saving water drinking individually in the database as of right now change this later 🙈
      updateHistory(testhistory)
   }
   catch (monkeyerror) {
      console.log(monkeyerror)
   }
}

goal();

// document.querySelector('.test').addEventListener('click', (event) => {
//    if(event.target.closest(".water_drank")) {
//       event.preventDefault();
//       let value = event.target.value

//       console.log(value)
//       axios.post("/data", {
//          water_drank: value
//       })
//        .then(function (response) {
//          console.log(response.data)
//          goal();
//        })
//        .catch(function (error) {
//          console.log(error)
//        })
//    }
// })

let water_inputs = document.querySelectorAll('.water_send');
for (let i = 0; i < water_inputs.length; i++) {
   water_inputs[i].addEventListener("click", (event) => {
      event.preventDefault();
      let value = event.target.value;
      console.log(value);
      closePopUp();
      axios.post("/data", {
         water_drank: value
      })
         .then(function (response) {
            console.log(response.data)
            goal();
         })
         .catch(function (error) {
            console.log(error)
         })
   })
}
let custom_water_button = document.querySelector('.custBtn');
let custom_water_input = document.querySelector('.custInput');
custom_water_button.addEventListener("click", (event) => {
   event.preventDefault();
   let value = Number(custom_water_input.value);
   if (value <= 0 || value > 10000) {
      return 
   }
   closePopUp();
   axios.post("/data", {
      water_drank: value
   })
      .then(function (response) {
         console.log(response.data)
         goal();
      })
      .catch(function (error) {
         console.log(error)
      })
})

function updateName(name) {
   let userName = document.querySelector('.username');
   userName.innerText = name;
}


function updatePet(petType) {
   let pet = document.querySelector('.mascot');
   pet.src = petType + '.svg';
}


function updateFavicon(pet_type) {
   if (pet_type === "monkee") {
      document.querySelector("link[rel*='icon']").href = "favicon.ico";
   }
   if (pet_type === "otter") {
      document.querySelector("link[rel*='icon']").href = "favicon1.ico";
   }
}


//popup functions
let addPopUp = document.querySelector('.addPopup')
let closeButton = document.querySelector('.close');
let blackOverlay = document.querySelector('.black_overlay');
let addButton = document.querySelector('.add');
function closePopUp() {
   addPopUp.style.display = "none";
   blackOverlay.style.display = "none";

}
function openPopUp() {
   addPopUp.style.display = "grid";
   blackOverlay.style.display = "flex";
}

blackOverlay.addEventListener("click", function (event) {
   closePopUp();
})
closeButton.addEventListener('click', function (event) {
   closePopUp();
})
addButton.addEventListener('click', function (event) {
   openPopUp();
})


function updateWater(current, goal) {
   let currentGoal = document.querySelector('.current_goal');
   let progressBar = document.querySelector('.progress_bar');
   if (current == undefined) {
      current = 0;
   }
   if (goal == undefined) {
      goal = 1;
   }
   // currentGoal.innerText = `${current}mL/\n${goal}mL`;
   currentGoal.innerText = `${current}mL/${goal}mL`;
   let progress = (Number(current) / Number(goal)) * 100;
   console.log("current % is " + progress);
   progressBar.value = progress;
   if (progress < 33) {
      updateBubble("sad");
   }
   else if (progress > 67) {
      updateBubble("happy");
      if (progress > 100) {
         finishGoal();
      }
   }
   else {
      updateBubble("neutral");
   }
}


function finishGoal() {
   let todaysGoalHeading = document.querySelector('.today_goal');
   let goalGradient = document.querySelector('.goal_gradient');
   goalGradient.style.opacity = "1";
   todaysGoalHeading.innerText = "Goal Reached!";
}


function updateBubble(mood) {
   let bubbleText = document.querySelector('.mascot_text');
   bubbleText.style.transform = "scale(1.5)";
   if (mood === "happy") {
      // console.log(mascotText.happy);
      bubbleText.innerText = mascotText.happy[(Math.floor(Math.random() * (mascotText.happy.length - 0)))];
   }
   if (mood === "neutral") {
      // console.log(mascotText.neutral);
      bubbleText.innerText = mascotText.neutral[(Math.floor(Math.random() * (mascotText.neutral.length - 0)))]
   }
   if (mood === "sad") {
      // console.log(mascotText.sad);
      bubbleText.innerText = mascotText.sad[(Math.floor(Math.random() * (mascotText.sad.length - 0)))]
   }
   setTimeout(() => {
      bubbleText.style.transform = "scale(1)";
   }, "1000");
}


let testhistory = ["History", "MONKEY TEST", "depression", "sadness", "Drink 4: 100 mL"];

// not saving each water input separately as of right now so can't have this fully functioning
function updateHistory(history) {
   let historySelect = document.querySelector("select");
   historySelect.innerHTML = "";
   for (let i = 0; i < history.length; i++) {
      historyItem = history[i];
      // console.log(historyItem)
      let option = document.createElement("option");
      option.innerText = historyItem;
      historySelect.append(option)
   }
}

let currentUser = {};



// if i see slay im checking the commits and banning you 🤗
// randomized text options for textbubble depending on pet mood, -33% = sad, 33-66% = neutral, +67% = happy
let mascotText = {
   happy: ["you're doing great", "good job", "👏",],
   neutral: ["hi", "nice", "you're doing good", "keep going strong", "drink water",],
   sad: ["D:", "you ugly", "i hate you", "damn you suck", "you smell", "🤡", "drink water please", "me thirsty", "💀", "shibar", "du ma"]
}

