// JavaScript code here
const taskContainer = document.querySelector(".task__container");

const globalStore = []; //array

console.log(taskContainer);

const generateNewCard = (taskData) =>
  ` 
    <div class="col-sm-12 col-md-6 col-lg-4" id="${taskData.id}">
      <div class="card" style="width: 18rem">
        <div class="card-header d-flex justify-content-end gap-2">
          <button type="button" class="btn btn-success" onclick="editCard('${taskData.id}')">
            <i class="fas fa-pencil-alt"></i>
          </button>
          <button type="button" class="btn btn-danger" onclick="deleteCard('${taskData.id}') ">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
        <div class="card-body">
          <img src="${taskData.imageUrl}" class="card-img-top" />
          <h5 class="card-title fw-bold text-primary mt-2">${taskData.taskTitle}</h5>
          <p class="card-text">
            ${taskData.taskDescription}
          </p>
          <a href="#" class="btn btn-primary">${taskData.taskType}</a>
          
        </div>
      </div>
    </div>
  `;

const loadInitialCardData = () => {
  //localstorage to navbar card data
  const getCardData = localStorage.getItem("navbar");

  //convert to normal object
  const { cards } = JSON.parse(getCardData);

  //loop over those array of task object to create HTML card, inject it to DOM
  cards.map((cardObject) => {
    taskContainer.insertAdjacentHTML("beforeend", generateNewCard(cardObject));
    //update our globalstore
    globalStore.push(cardObject);
  });
};

const saveChanges = () => {
  const fileInput = document.getElementById("imageupload");
  const file = fileInput.files[0]; //select the file

  const reader = new FileReader();
  reader.readAsDataURL(file); //file read as it is data url

  reader.onload = function () {
    const imageDataUrl = reader.result; // take data url

    const taskData = {
      id: `${Date.now()}`,
      imageUrl: imageDataUrl,
      taskTitle: document.getElementById("tasktitle").value,
      taskType: document.getElementById("tasktype").value,
      taskDescription: document.getElementById("taskdescription").value,
    };

    taskContainer.insertAdjacentHTML("beforeend", generateNewCard(taskData));

    globalStore.push(taskData);
    localStorage.setItem("navbar", JSON.stringify({ cards: globalStore }));
  };
};

let deletedCards = [];
// Below deleteCard() function delete the taskCard from taskContainer..
const deleteCard = (id) => {
  // if (!isUserAuthenticated()) {
  //   alert("Please login to delete the card.");
  //   return;
  // }

  // // Check if the authenticated user has the necessary permissions to delete
  // if (!hasDeletePermissions()) {
  //   alert("You don't have permission to delete the card.");
  //   return;
  // }

  const index = globalStore.findIndex((taskData) => taskData.id === id);

  if (index !== -1) {
    const deletedCard = globalStore.splice(index, 1)[0]; // Remove and store the deleted card
    deletedCards.push(deletedCard); // Store the deleted card in the array

    const cardElement = document.getElementById(id);
    if (cardElement) {
      cardElement.remove();
    }

    localStorage.setItem("navbar", JSON.stringify({ cards: globalStore }));
  }
};

// Below editCard() function edit the taskCard from taskContainer..
function editCard(id) {
  const cardIndex = globalStore.findIndex((card) => card.id === id);
  if (cardIndex === -1) {
    console.log("Card not found");
    return;
  }

  const card = globalStore[cardIndex];
  const originalCardData = { ...card };

  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";
  fileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = function () {
      // const newImageUrl = prompt("Enter the new image URL", card.imageUrl);
      const newTaskTitle = prompt("Enter the new task title", card.taskTitle);
      const newTaskType = prompt("Enter the new task type", card.taskType);
      const newTaskDescription = prompt("Enter the new task description", card.taskDescription);


      const imageDataUrl = reader.result;
      card.imageUrl = imageDataUrl;
      card.taskTitle = newTaskTitle;
      card.taskType = newTaskType;
      card.taskDescription = newTaskDescription;


      const cardElement = document.getElementById(id);
      if (cardElement) {
        cardElement.innerHTML = generateNewCard(card);
      }

      const confirmChanges = confirm("Do you want to save the changes?");
      if (!confirmChanges) {
        globalStore[cardIndex] = originalCardData;

        if (cardElement) {
          cardElement.innerHTML = generateNewCard(originalCardData);
        }
      }

      localStorage.setItem("navbar", JSON.stringify({ cards: globalStore }));
    };
  });

  fileInput.click();
}



// function isUserAuthenticated() {
//   //  authentication check logic
//   // Return true if the user is authenticated, otherwise false
// }

// function hasDeletePermissions() {
//   //   permission check logic here
//   // Return true if the authenticated user has delete permissions, otherwise false
// }

// function restoreDeletedCard() {
//   const deletedCardIndex = deletedCards.findIndex((card) => card.id === id);

//   if (deletedCardIndex !== -1) {
//     const restoredCard = deletedCards.splice(deletedCardIndex, 1)[0];
//     globalStore.push(restoredCard);

//     localStorage.setItem("navbar", JSON.stringify({ cards: globalStore }));

//     taskContainer.insertAdjacentHTML(
//       "beforeend",
//       generateNewCard(restoredCard)
//     );
//   }
// }

const searchInput = document.getElementById("searchInput");
const cardNotFound = document.getElementById("cardNotFound");

searchInput.addEventListener("input", searchTaskCards);

var searchTaskCards = (event) => {
  const searchQuery = event.target.value.toLowerCase().trim();

  // Filter the task cards based on the search query
  const filteredCards = globalStore.filter((taskData) => {
    const title = taskData.taskTitle.toLowerCase();
    const description = taskData.taskDescription.toLowerCase();
    const type = taskData.taskType.toLowerCase();

    return (
      title.includes(searchQuery) ||
      description.includes(searchQuery) ||
      type.includes(searchQuery)
    );
  });

  // Clear the task container
  taskContainer.innerHTML = "";

  // Render the filtered task cards or display a message
  if (filteredCards.length === 0) {
    const message = `
      <div class="col">
        <p class="text-muted">No matching cards found.</p>
      </div>
    `;
    taskContainer.insertAdjacentHTML("beforeend", message);
  } else {
    filteredCards.forEach((taskData) => {
      taskContainer.insertAdjacentHTML("beforeend", generateNewCard(taskData));
    });
  }
};

// Event listener for the search input

searchInput.addEventListener("input", searchTaskCards);
