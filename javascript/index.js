import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js'
import { getDatabase, ref, push, update, onValue } from 'https://www.gstatic.com/firebasejs/10.12.1/firebase-database.js'

const firebaseConfig = {
  databaseURL: "https://realtime-database-a5675-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const endorsementListInDB = ref(database, "endorsementList");

const endorsementFieldEl = document.getElementById("endorsement-field");
const fromFieldEl = document.getElementById("from-field");
const toFieldEl = document.getElementById("to-field");
const publishButtonEl = document.querySelector(".input__button");
const endorsementListEl = document.querySelector(".output__list");


publishButtonEl.addEventListener("click", () => {
  let endorsement = {
    message: endorsementFieldEl.value,
    from: fromFieldEl.value,
    to: toFieldEl.value,
    rating: 0,
  }

  push(endorsementListInDB, endorsement)

  clearInputField(endorsementFieldEl);
  clearInputField(fromFieldEl);
  clearInputField(toFieldEl);
})

onValue(endorsementListInDB, (snapshot) => {
  if ( snapshot.exists() ) {
    const endorsementArray = Object.entries(snapshot.val());
    clearEndorsementListEl()
    
    for (let i = 0; i < endorsementArray.length; i++ ) {
      const currentEndorsement = endorsementArray[i];

      appendEndorsementToEndorsementListEl(currentEndorsement);
    }
  } else {
    endorsementListEl.innerHTML = "No endorsements currently...";
  }
})

function clearInputField(el) {
  el.value = "";
}

function clearEndorsementListEl() {
  endorsementListEl.innerHTML = "";
}

function appendEndorsementToEndorsementListEl(endorsement) {
  const endorsementID = endorsement[0];
  const endorsementFrom = endorsement[1].from;
  const endorsementMessage = endorsement[1].message;
  const endorsementTo = endorsement[1].to;
  let endorsementRating = endorsement[1].rating;

  const endorsementEl = document.createElement("li");
  const footerEl = document.createElement("div");
  const toEl = document.createElement("p");
  const ratingEl = document.createElement("p");
  const heartEl = document.createElement("span")

  endorsementEl.innerHTML = `
  <div class="endorsement__header">
      <p>To ${endorsementTo}</p>
  </div>
  <div class="endorsement__body">
      <p>${endorsementMessage}</p>
  </div>
  `
  toEl.textContent = `From ${endorsementFrom}`;
  
  ratingEl.textContent = endorsementRating;
  heartEl.classList = "endorsement__heart";
  heartEl.textContent = `❤️`;
  ratingEl.prepend(heartEl);

  heartEl.addEventListener("click", () => {
    ratingEl.textContent = updateHeartRating(endorsementID, endorsementRating);
  })
  
  footerEl.className = "endorsement__footer | flex";
  footerEl.append(toEl);
  footerEl.append(ratingEl);
  
  endorsementEl.className = "output__endorsement"
  endorsementEl.append(footerEl);

  endorsementListEl.prepend(endorsementEl);
}

function updateHeartRating(id, rating) {
  ++rating
  const exactLocationInDB = ref(database, `endorsementList/${id}`) 
  update(exactLocationInDB, {rating: rating});
  return rating;
}