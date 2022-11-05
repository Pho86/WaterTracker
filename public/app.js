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

// axios.get('/data')
// .then (function(res){
//    console.log(res)
// })

// fetch data with async and await function
const goal = async () => {
   try {
      const data = await fetch('../data');
      // console.log(data)
      const currentUser = await data.json();
      console.log(currentUser);
      updateName(currentUser.name);
      updatePet(currentUser.pet);
      if (currentUser.pet === "otter") {
         document.querySelector("link[rel*='icon']").href = "favicon1.ico";
      }
      updateWater(currentUser.drank, currentUser.goal);
      // using test array right now change later 🙈
      updateHistory(testhistory)
   }
   catch (monkeyerror) {
      console.log(monkeyerror)
   }
}

goal();

function updateName(name) {
   let userName = document.querySelector('.username');
   userName.innerText = name;
}
// export {updateName}

function updatePet(petType) {
   let pet = document.querySelector('.mascot');
   pet.src = petType + '.svg';
}



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
   console.log(progress);
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
   let bubbleText = document.querySelector('.mascot_text')
   if (mood === "happy") {
      console.log(mascotText.happy)
      bubbleText.innerText = mascotText.happy[(Math.floor(Math.random() * (mascotText.happy.length - 0)))]
   }
   if (mood === "neutral") {
      console.log(mascotText.neutral)
      bubbleText.innerText = mascotText.neutral[(Math.floor(Math.random() * (mascotText.neutral.length - 0)))]
   }
   if (mood === "sad") {
      console.log(mascotText.sad)
      bubbleText.innerText = mascotText.sad[(Math.floor(Math.random() * (mascotText.sad.length - 0)))]
   }
}

let testhistory = ["History", "MONKEY TEST", "depression", "sadness", "Drink 4 150 mL"];

// idk how to do this but ok
function updateHistory(history) {
   let historySelect = document.querySelector("select");
   historySelect.innerHTML = "";
   console.log(historySelect)
   for (let i = 0; i < history.length; i++) {
      historyItem = history[i];
      console.log(historyItem)
      let option = document.createElement("option");
      option.innerText = historyItem;
      historySelect.append(option)
   }
}

let currentUser = {};

// if i see slay im checking the commits and banning you
let mascotText = {
   happy: ["you're doing great", "good job", "👏",],
   neutral: ["hi", "nice", "you're doing good", "keep going strong", "drink water",],
   sad: ["D:", "you ugly", "i hate you", "damn you suck", "you smell", "🤡", "drink water please", "me thirsty", "💀", "shibar", "du ma"]
}
// "shibar", "du ma"

