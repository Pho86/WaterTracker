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
      // updateName(currentUser.name);
      // updatePet(currentUser.pet_type);
      updateFavicon(currentUser.pet_type)
      updateWater(currentUser.water_drank, currentUser.water_goal);
      // using test array to visualize history as not saving water drinking individually in the database as of right now change this later 🙈
      updateHistory(testhistory)
   }
   catch (monkeyerror) {
      console.log(monkeyerror)
   }
}

// goal();

// send data with the popup buttons to /data as a post request when clicked
let water_inputs = document.querySelectorAll('.water_send');
for (let i = 0; i < water_inputs.length; i++) {
   water_inputs[i].addEventListener("click", async (event) => {
      event.preventDefault();
      let value = event.target.value;
      const data = await fetch('../data');
      const currentUser = await data.json();
      totalWater = Number(currentUser.water_drank) + Number(value);
      console.log(totalWater);
      closePopUp();
      axios.post("/data", {
         water_drank: totalWater
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

// send a post request to /data when custom input is submitted
let custom_water_button = document.querySelector('.custBtn');
let custom_water_input = document.querySelector('.custInput');
custom_water_button.addEventListener("click", async (event) => {
   event.preventDefault();
   let value = Number(custom_water_input.value);
   if (value <= 0 || value > 10000) {
      return
   }
   const data = await fetch('../data');
   const currentUser = await data.json();
   totalWater = Number(currentUser.water_drank) + value;
   closePopUp();
   axios.post("/data", {
      water_drank: totalWater
   })
      .then(function (response) {
         console.log(response.data)
         goal();
      })
      .catch(function (error) {
         console.log(error)
      })
})

//update name text fields
function updateName(name) {
   let userName = document.querySelector('.username');
   userName.innerText = name;
}

// update pet image
function updatePet(petType) {
   let pet = document.querySelector('.mascot');
   pet.src = petType + '.svg';
}

// update favicon depending on what pet you have
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

// update the progress bar depending on % of goal completed
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

// goal completion changes to screen when goal is reached
function finishGoal() {
   let todaysGoalHeading = document.querySelector('.today_goal');
   let goalGradient = document.querySelector('.goal_gradient');
   goalGradient.style.opacity = "1";
   todaysGoalHeading.innerText = "Goal Reached!";
}

// update the pet text bubble randomly and scale up and down
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
// update history select and add options 
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
// object/arrays for randomized text options for textbubble depending on the pet's mood, -33% = sad, 33-66% = neutral, +67% = happy
let mascotText = {
   happy: ["you're doing great", "good job", "👏","SLAYYYY", "YAS QUEEN 💅💅💅",],
   neutral: ["hi", "nice", "you're doing good", "keep going strong", "drink water","hydrate me", "lips feel dry"],
   sad: ["D:", "you ugly", "i hate you", "damn you suck", "🤡", "drink water please", "me thirsty", "💀", "shibar", "du ma","piss gon b yellow", "be better"]
}

