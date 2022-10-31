const goal = () => {
   //fetch fake database as of right now
   fetch('../data')
      .then(res => res.json())
      .then(function (user) {
         let currentUser = user;
         console.log(currentUser);
         updateName(currentUser.name);
         updatePet(currentUser.pet);
         updateWater(currentUser.drank, currentUser.goal);
      })
      .catch(function(monkey) {
         console.log(monkey)
      })
}

goal();

// const goal2 = async () => {
//    console.log(await(await fetch('../data')).json());
//    // let currentUser = (await (await fetch('../data')).json());
// }
// goal2();

function updateName(name) {
   let userName = document.querySelector('.username');
   userName.innerText =  name
}
function updatePet(petType) {
   let pet = document.querySelector('.mascot');
   pet.src = petType + '.svg'
}
function updateWater(current, goal) {
   let currentGoal = document.querySelector('.current_goal');
   if (current == undefined) {
      current = 0;
   }
   currentGoal.innerText = ` ${current}ml/${goal}ml `
}

let currentUser = {};

