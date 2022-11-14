// fetch the current users data from the server and return it as a json
async function fetchUser() {
   const data = await fetch('../data');
   const currentUser = await data.json();
   return currentUser;
}

// render user data that constantly changes when water is intaked with an async and await function
const renderUser = async () => {
   try {
      const currentUser = await fetchUser()
      console.log(currentUser);
      updateFavicon(currentUser.pet_type)
      updateWater(currentUser.water_drank, currentUser.water_goal , currentUser.pet_type);
      await updateHistory(historyWater);
   }
   catch (error) {
      console.log(error)
   }
}

renderUser();


let historyWater = []
// send data with the popup buttons to /data as a post request with axios when clicked
let water_inputs = document.querySelectorAll('.water_send');
for (let i = 0; i < water_inputs.length; i++) {
   water_inputs[i].addEventListener("click", async (event) => {
      event.preventDefault();
      let value = event.target.value;
      const currentUser = await fetchUser();
      totalWater = Number(currentUser.water_drank) + Number(value);
      closePopUp();
      historyWater.push(Number(value))
      axios.post("/data", {
         water_drank: totalWater
      })
         .then(function (response) {
            console.log(response.data)
            renderUser();
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
   const currentUser = await fetchUser();
   let value = Number(custom_water_input.value);
   if (value <= 0 || value > 10000) {
      return
   }
   totalWater = Number(currentUser.water_drank) + value;
   historyWater.push(value);
   closePopUp();
   custom_water_input.value = "";
   axios.post("/data", {
      water_drank: totalWater
   })
      .then(function (response) {
         console.log(response.data)
         renderUser();
      })
      .catch(function (error) {
         console.log(error)
      })
})


// update favicon depending on what pet you have
function updateFavicon(pet_type) {
   if (pet_type === "monkee") {
      document.querySelector("link[rel*='icon']").href = "favicon.ico";
   }
   if (pet_type === "otter") {
      document.querySelector("link[rel*='icon']").href = "favicon1.ico";
   }
}


// update pet image, called in updateWater function, if happiness parameter is given, change pet image depending on the string given, otherwise return neutral 
function updatePet(petType, happiness) {
   let pet = document.querySelector('.mascot');
   if (happiness) {
      pet.src = petType + '_' + happiness + '.svg';
   }
   else {
      pet.src = petType + '.svg';
   }
}


//popup functions
let addPopUp = document.querySelector('.addPopup');
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


// update the progress bar depending on % of goal completed and change the pet's happiness level
function updateWater(current, goal, currentUserPet) {
   let currentGoal = document.querySelector('.current_goal');
   let progressBar = document.querySelector('.progress_bar');
   currentGoal.innerText = `${current}mL/${goal}mL`;
   let progress = (Number(current) / Number(goal)) * 100;
   console.log("current % is " + progress);
   progressBar.value = progress;
   if (progress < 33) {
      updateBubble(-1);
      updatePet(currentUserPet, "sad");
   }
   else if (progress > 67) {
      updateBubble(1);
      updatePet(currentUserPet, "happy");
      if (progress > 100) {
         finishGoal();
      }
   }
   else {
      updateBubble(0);
      updatePet(currentUserPet);
   }
}


// goal completion overlay appears when water goal is reached, function is called in updateWater function
function finishGoal() {
   let todaysGoalHeading = document.querySelector('.today_goal');
   let goalGradient = document.querySelector('.goal_gradient');
   goalGradient.style.opacity = "1";
   todaysGoalHeading.innerText = "Goal Reached!";
}


// update the pet text bubble randomly depending on mood and transform the text bubble by scaling up/down
// moods are === 1 = happy, 0 = neutral, -1 = sad
function updateBubble(mood) {
   let bubbleText = document.querySelector('.mascot_text');
   bubbleText.style.transform = "scale(1.5)";
   if (mood === 1) {
      bubbleText.innerText = mascotText.happy[(Math.floor(Math.random() * (mascotText.happy.length - 0)))];
   }
   if (mood === 0) {
      bubbleText.innerText = mascotText.neutral[(Math.floor(Math.random() * (mascotText.neutral.length - 0)))]
   }
   if (mood === -1) {
      bubbleText.innerText = mascotText.sad[(Math.floor(Math.random() * (mascotText.sad.length - 0)))]
   }
   setTimeout(() => {
      bubbleText.style.transform = "scale(1)";
   }, "1000");
}


// update history select and add options and select the newest option, if they haven't drank any water show default text
let water_history = []
async function fetchHistory() {
   const data = await fetch('../history');
   const currentHistory = await data.json();
   return currentHistory;
}
async function updateHistory(history) {
   let historySelect = document.querySelector("select");
   historyItem = history[history.length - 1];
   if (historyItem !== undefined) {
      water_history.push(historyItem);
      axios.post("/history", {
         history: water_history
      })
         .then((response) => console.log(response.data))
         .catch((error) => console.log(error))
   }
   await fetchHistory()
      .then((response) => {
         console.log(response)
         historySelect.innerHTML = "";
         for (let i = 0; i < response.length; i++) {
            let option = document.createElement("option");
            option.innerText = [i + 1] + " Glass " + response[i] + "mL";
            historySelect.value = [i + 1] + " Glass " + response[i] + "mL";
            historySelect.prepend(option);
         }
         if (response.length === 0) {
            let option = document.createElement("option");
            option.innerText = "No water this session";
            historySelect.append(option);
         }
      })
      .catch((error) => {
         console.log(error)
         historySelect.innerHTML = "";
         let option = document.createElement("option");
         option.innerText = "No water this session";
         historySelect.append(option);
      })
}


// if i see slay im checking the commits and banning you 🤗
// object/arrays for randomized text options for textbubble depending on the pet's mood, -33% = sad, 33-66% = neutral, +67% = happy
let mascotText = {
   happy: ["you're doing great", "good job", "👏", "SLAYYYY", "YAS QUEEN 💅💅💅",],
   neutral: ["hi", "nice", "you're doing good", "keep going strong", "drink water", "hydrate me", "lips feel dry"],
   sad: ["D:", "you ugly", "i hate you", "damn you suck", "🤡", "drink water please", "me thirsty", "💀", "shibar", "du ma", "piss gon b yellow", "be better"]
}