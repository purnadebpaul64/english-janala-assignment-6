// loader
function showLoader() {
  document.getElementById("loader").classList.remove("hidden");
  document.getElementById("lesson-content-section").classList.add("hidden");
}
function hideLoader() {
  document.getElementById("loader").classList.add("hidden");
  document.getElementById("lesson-content-section").classList.remove("hidden");
}

// login toogle
function login() {
  document.getElementById("nav-bar").classList.remove("hidden");
  document.getElementById("hero").classList.add("hidden");
  document.getElementById("vocabularies-section").classList.remove("hidden");
  document.getElementById("faq-section").classList.remove("hidden");
}

function logout() {
  document.getElementById("nav-bar").classList.add("hidden");
  document.getElementById("hero").classList.remove("hidden");
  document.getElementById("vocabularies-section").classList.add("hidden");
  document.getElementById("faq-section").classList.add("hidden");

  document.getElementById("user-name").value = "";
  document.getElementById("password").value = "";
}

// login system
document.getElementById("login-btn").addEventListener("click", (event) => {
  event.preventDefault();
  const userName = document.getElementById("user-name").value;
  const password = document.getElementById("password").value;
  if (userName != "") {
    if (password === "123456") {
      login();
      setTimeout(function () {
        alert("successfully logged in");
      }, 100);
    } else {
      alert("worng Password");
    }
  } else {
    alert("Please tell us your name first");
  }
});

// Word Pronounceation
function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN";
  window.speechSynthesis.speak(utterance);
}

// vocabularie section button

function loadVocaButtons() {
  fetch("https://openapi.programming-hero.com/api/levels/all")
    .then((res) => res.json())
    .then((data) => displayVocButtons(data.data));
}

function displayVocButtons(buttons) {
  const vocButtonSection = document.getElementById("vocButtonSection");
  for (const btn of buttons) {
    const vocButtonDIv = document.createElement("div");
    vocButtonDIv.innerHTML = `
        <button id="btn-${btn.level_no}" onclick="loadLessons(${btn.level_no})" class="btn btn-sm btn-outline btn-primary"><i class="fa-solid fa-book-open"></i>${btn.lessonName}</button>
        `;
    vocButtonSection.append(vocButtonDIv);
  }
}

loadVocaButtons();

// remove active class for category button
function removeActiveClass() {
  const activeButtons = document.getElementsByClassName("active");
  for (let btn of activeButtons) {
    btn.classList.remove("active");
  }
}
// voc button click lessons

function loadLessons(levelID) {
  showLoader();
  const url = `https://openapi.programming-hero.com/api/level/${levelID}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      removeActiveClass();
      const clickedButton = document.getElementById(`btn-${levelID}`);
      clickedButton.classList.add("active");
      displayLessons(data.data);
    });
}

function displayLessons(lessons) {
  const leassonDisplaySection = document.getElementById(
    "lesson-content-section"
  );
  leassonDisplaySection.innerHTML = ``;
  if (lessons.length === 0) {
    leassonDisplaySection.innerHTML = `
        <div class="col-span-3">
          <div class="space-y-4 text-center flex flex-col items-center">
            <img class="w-28" src="assets/alert-error.png" alt="">
            <p class="hind text-sm">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
            <h2 class="hind text-3xl">নেক্সট Lesson এ যান</h2>
          </div>
        </div>
    
    `;
  }
  for (const les of lessons) {
    const lessonDiv = document.createElement("div");
    if (les.meaning === null) {
      les.meaning = "অর্থ খুঁজে পাওয়া যায়নি";
    }
    lessonDiv.innerHTML = `
        <div class="bg-white p-4 rounded-lg">
      <div class="items-center text-center space-y-3 border-2 border-[#f8f8f8] p-2 rounded">
        <h2 class="text-2xl text-black font-semibold inter">${les.word}</h2>
        <p class="text-black">Meaning /Pronounciation</p>
        <h2 class="text-xl black font-semibold hind">"${les.meaning}"</h2>
        <div class="flex justify-between">
          <button onclick="loadWordDetails(${les.id})" class="cursor-pointer py-2 px-3 bg-[#1A91FF10] border-none">
            <i class="fa-solid fa-circle-info"></i>
          </button>
          <button onclick=pronounceWord('${les.word}') class="cursor-pointer py-2 px-3 bg-[#1A91FF10] border-none">
            <i class="fa-solid fa-volume-high"></i>
          </button>
        </div>
      </div>
    </div>
        `;
    leassonDisplaySection.append(lessonDiv);
  }
  hideLoader();
}

// word details
function loadWordDetails(wordID) {
  const url = `https://openapi.programming-hero.com/api/word/${wordID}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => displayWordDetails(data.data));
}

function displayWordDetails(worddtls) {
  document.getElementById("word_details").showModal();
  const displayWordDetailsSection = document.getElementById(
    "display-word-details-section"
  );
  if (worddtls.meaning === null) {
    worddtls.meaning = "অর্থ খুঁজে পাওয়া যায়নি";
  }
  // const displayWordDetailsDiv = document.createElement("div");
  displayWordDetailsSection.innerHTML = `
  <div class="modal-box p-5 w-140">
          <div class="border-2 border-[#EDF7FF] p-3 rounded space-y-4">
            <h3 class="text-3xl font-bold poppins">
              ${worddtls.word} (<i class="fa-solid fa-microphone-lines"></i> :${worddtls.pronunciation})
            </h3>
            <div>
              <h2 class="poppins text-lg font-semibold">Meaning</h2>
              <h2 class="hind text-lg font-semibold">${worddtls.meaning}</h2>
            </div>
            <div>
              <h2 class="poppins text-lg font-semibold">Example</h2>
              <h2>${worddtls.sentence}</h2>
            </div>
            <div>
              <h2 class="hind text-lg font-semibold pb-3">সমার্থক শব্দ গুলো</h2>
              <div id="Synonyms-section" class="flex gap-2">
                
              </div>
            </div>
          </div>
          <div class="modal-action flex justify-start">
            <form method="dialog">
              <!-- if there is a button in form, it will close the modal -->
              <button class="btn bg-[#422ad5] text-white">
                Complete Learning
              </button>
            </form>
          </div>
        </div>
  `;

  for (const syn of worddtls.synonyms) {
    const synonymsSection = document.getElementById("Synonyms-section");
    const synonymsSectionDiv = document.createElement("div");
    synonymsSectionDiv.innerHTML = `
    <button class="btn bg-[#EDF7FF] mr-1.5 border-[#D7E4EF]">
                  ${syn}
                </button>
    `;
    synonymsSection.append(synonymsSectionDiv);
  }
}
