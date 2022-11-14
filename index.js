const API_ENDPOINT = 'https://www.balldontlie.io/api/v1/players';


const app = document.getElementById('app');


const dataSort = document.getElementById("data-sort");

dataSort.addEventListener("change", async (event) => {
  console.log("Data Sort Change:", event.target.value); // prints to console the name of the selected sort
  const data = await getData();
  await renderUI(data);
})


const dataFilter = document.getElementById("data-filter");

dataFilter.addEventListener("change", async (event) => {
  console.log("Data Filter Change:", event.target.value); // prints to console the name of the selected filter
  const data = await getData();
  await renderUI(data);
})



// this is the function we build our data in.
async function getData() {
  let data = null;
  try {
    const response = await fetch(API_ENDPOINT);
    if (response.status === 200) { // success status
      data = await response.json();
    }
  } catch (error) {
    console.log('api error');
    console.error(error);
  }
  data = filterData(data, dataFilter.value);
  data = sortData(data, dataSort.value)
  console.log(data);
  return data;
}


// Helper function to clear our app UI
function clearUI() {
  // This looks into app and removes its children until app is empty of children
  while (app.firstChild) {
    app.removeChild(app.firstChild);
  }
}


// function that contains all the UI rendering code
async function renderUI(data){
  clearUI();
  data.data.forEach(player => {
    const full_name = `${player.first_name} ${player.last_name}`;
    const team_name = `${player.team.full_name}<br>(${player.team.abbreviation})`;
    const position = player.position ? player.position : "-";
    
    const divItemElement = Object.assign(document.createElement("div"), { className: "item" });

    const divContentElement = Object.assign(document.createElement("div"), { className: "content"});

    divContentElement.innerHTML = `<h2>${full_name}</h2> 
                                  <p> Team: <br> ${team_name} </p> 
                                  <p> Position: <br> ${position} </p>`;

    divItemElement.appendChild(divContentElement);
    app.appendChild(divItemElement);
  });
}



// Our function to filter the data based on the user selection
// See the HTML select element for the filter - there are 3 possible values, which in this function are the "key"
// 1. "posC" , 2. "posF", 3. "posG" 
function filterData(data, key) {
  switch(key){
    case "posC":
        data.data = data.data.filter( (player) => player.position.includes("C") );
        break;
    case "posF": 
        data.data = data.data.filter( (player) => player.position.includes("F") );
        break;
    case "posG":
        data.data = data.data.filter( (player) => player.position.includes("G") );
        break;  
  }
  return data;
}

// Our function to sort the data based on the user selection
// See the HTML select element for the sort - there are 3 possible values, which in this function are the "key"
// 1. "sortFN" means Sort by first names  2. "sortLN" means Sort by last names  3. "sortTN" means Sort by players team name
function sortData(data, key) {
  if (key === "sortFN"){
    data.data = data.data.sort((p1, p2) => (p1.first_name > p2.first_name)? 1 : (p1.first_name < p2.first_name) ? -1 : 0);
  }
  if (key === "sortLN"){
    data.data = data.data.sort((p1, p2) => (p1.last_name > p2.last_name)? 1 : (p1.last_name < p2.last_name) ? -1 : 0);
  }
  if (key === "sortTN"){
    data.data = data.data.sort((p1, p2) => (p1.team.full_name > p2.team.full_name)? 1 : (p1.team.full_name < p2.team.full_name) ? -1 : 0);
  }
  return data;
}

// Below are functions we are calling as this JavaScript module loads, so, essentially when the page loads

const data = await getData(); // Get initial data

await renderUI(data); // initialize UI with the initial data
