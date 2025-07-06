      




//Function to submit user input from the home template
function submitUserGoal() {
    const userGoal = document.getElementById("userGoal").value;
    sessionStorage.setItem("userGoal", userGoal);
  };

//Submit Search
function submitSearch() {
    const userSubject = document.getElementById("userSubject").value;
    const userType = document.getElementById("userType").value;
    sessionStorage.setItem("userSubject", userSubject);
    sessionStorage.setItem("userType", userType);
    
};

//Submit Reflection Page
function submitReflection() {
    const userClass = document.getElementById("userClass").value;
    const userSummary = document.getElementById("userSummary").value;
    const userReflection = document.getElementById("userReflection").value;
    sessionStorage.setItem("userClass", userClass);
    sessionStorage.setItem("userSummary", userSummary);
    sessionStorage.setItem("userReflection", userReflection);
  };

  


  

//Fetch the template text and check for errors
function loadTemplate(templateUrl) {
    return fetch(templateUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Template not found');
            };
            return response.text();
        });
};

//Render the templates into app element
function renderTemplate(templateContent) {
    const appContainer = document.getElementById('app');
    const hash = window.location.hash;
    appContainer.classList.add("transition-enter");
    setTimeout(() => {
        appContainer.innerHTML = templateContent;
        appContainer.classList.add("transition-enter-active");
        
        //Template specific logic
        switch (hash) {
            case "#phase2":
                const submitBtn = document.getElementById("toPhase3");
                submitBtn.addEventListener("click", submitUserGoal);
                checkGoalInStorage (); 
                
                break;
           
            case "#phase3":
                const submitSearchBtn = document.getElementById("submitSearchbtn");
                submitSearchBtn.addEventListener("click", submitSearch);
               
                break;
            
            case "#search": 
                searchStrategies ();
                
                break;

            case "#focustime":
               
                const workTimeInput = document.getElementById("work-time");
                const timerStart = document.getElementById("timer-start");
                const timerPause = document.getElementById("timer-pause");
                const timerResume = document.getElementById("timer-resume");
                const timerRestart = document.getElementById("timer-restart");
                const timerMinutes = document.getElementById("timer-minutes");
                const timerSeconds = document.getElementById("timer-seconds");
                const darkModeSwitch = document.getElementById('dark-mode-switch');
                const toggleSlider = document.querySelector('.toggle-slider');

                checkGoalInStorage ();

                

                
                //Timer stuff
                let interval;
                let timeRemaining;

                function updateTimerDisplay(minutes, seconds) {
                    timerMinutes.textContent = String(minutes).padStart(2, "0");
                    timerSeconds.textContent = String(seconds).padStart(2, "0");
                }

                function startTimer(duration) {
                    timeRemaining = duration;
                    updateTimerDisplay(Math.floor(duration / 60), duration % 60);

                    interval = setInterval(() => {
                        timeRemaining--;

                        if (timeRemaining < 0) {
                        clearInterval(interval);
                        new Audio(
                            "https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3"
                        ).play();
                        
                        return;
                        }

                        updateTimerDisplay(Math.floor(timeRemaining / 60), timeRemaining % 60);
                    }, 1000);
                }

                
                timerStart.addEventListener("click", () => {
                timerStart.setAttribute("hidden", "");
                timerPause.removeAttribute("hidden");
                timerRestart.removeAttribute("hidden");
                startTimer(parseInt(workTimeInput.value) * 60);
                });

                timerPause.addEventListener("click", () => {
                timerPause.setAttribute("hidden", "");
                timerResume.removeAttribute("hidden");
                clearInterval(interval);
                });

                timerResume.addEventListener("click", () => {
                timerResume.setAttribute("hidden", "");
                timerPause.removeAttribute("hidden");
                startTimer(timeRemaining);
                });

                timerRestart.addEventListener("click", () => {
                clearInterval(interval);
                timerStart.removeAttribute("hidden");
                timerPause.setAttribute("hidden", "");
                timerResume.setAttribute("hidden", "");
                timerRestart.setAttribute("hidden", "");
                updateTimerDisplay(parseInt(workTimeInput.value), 0);
                });

               

               /* document.addEventListener("DOMContentLoaded", () => {});

                darkModeSwitch.addEventListener("change", () => {
                document.body.classList.toggle("dark-mode", darkModeSwitch.checked);
                });

                toggleSlider.addEventListener("click", () => {
                darkModeSwitch.checked = !darkModeSwitch.checked;
                document.body.classList.toggle("dark-mode", darkModeSwitch.checked);
                });*/


                //Editing goal set-up along with the 
                const submitBtn2 = document.getElementById("toPhase5");
                submitBtn2.addEventListener("click", submitUserGoal);

                 
                break;

            case "#phase7":
                printGoal();

                break;
            case "#phase8":
                printGoal();
                printStrategy();
                saveReflection();
                
                const summaryBtn = document.getElementById("toSummary");
                summaryBtn.addEventListener("click", submitReflection);
                

                break;

            case "#summary":
                
                printGoal();
                printStrategy();
                printReflection();
                const endButton = document.getElementById("endSession");    
                endButton.addEventListener('click', endSession);
        };
        
        setTimeout(() => {
            appContainer.classList.remove("transition-enter", "transition-enter-active");
        }, 400);
   }, 300);   
}



//Main function that handles routing
function handleHashChange() {
    const hash = window.location.hash;
    const templateId = hash.slice(1) + '.html';
    const templateUrl = `templates/${templateId}`;

    loadTemplate(templateUrl)  
        .then(renderTemplate)
        .catch(error => {
            // Redirect to the home template on error
            window.location.hash = 'home';
        });
}

// Attach hash change event listener
window.addEventListener('hashchange', handleHashChange);

// Initial load based on current hash or set to home-template.html
window.addEventListener('load', () => {
    if (!window.location.hash) {
        window.location.hash = 'home';
    } else {
        handleHashChange();
    }
});


//**********Sidebar logic**********************

//fetch Strategy templates - uses same load template function above targetting sratcontainer
function renderStrategy(templateContent) {
    const theSidebar = document.querySelector('.stratContainer');
    theSidebar.innerHTML = templateContent;
}

//adds template to sidebar MOved session storage add process into click event and it works...idk why
function handleButtonClick(buttonId, templateUrl) {
    const button = document.getElementById(buttonId);
    const saveUrl = templateUrl;
    button.addEventListener('click', async () => {
        const templateContent = await loadTemplate(templateUrl);
        renderStrategy(templateContent);
        sessionStorage.setItem("sidebarpath", saveUrl);
        displaySidebar();
        accordion();
    });
}
// Checks session storage to see if sidebar should be displayed
window.addEventListener("load", e => {
    if (sessionStorage.getItem("sidebarStatus")) {
        var storeit = document.querySelector(".sidebar");
        storeit.classList.remove('hidden');
        storeit.classList.remove('full');
        storeit.classList.add('stow');
    }  
} );

//This checks strat path in session memory and reload correct strat on reload
window.addEventListener('load', async () => {
    if (sessionStorage.getItem("sidebarpath")){
    const templateUrl = sessionStorage.getItem("sidebarpath");
    const templateContent = await loadTemplate(templateUrl);
    renderStrategy(templateContent);
    accordion();
} });

//Siebar toggle
document.getElementById("togglebtn").addEventListener('click', toggleSidebar);


//shows sidebar at full width
function displaySidebar() {
        document.querySelector(".sidebar").classList.remove("hidden");
        document.querySelector(".sidebar").classList.remove("stow");
        document.querySelector(".sidebar").classList.add("full");
        sessionStorage.setItem("sidebarStatus", "true");
        document.querySelector(".stratContainer").classList.toggle("hideScroll"); 
        document.getElementById("togglebtn").classList.add("rotateToggle");
}

function prepSidebar() {
    document.querySelector(".sidebar").classList.remove("hidden");
    sessionStorage.setItem("sidebarStatus", "true");
}


//toggle sidebar full/stow

function toggleSidebar() {
    document.querySelector(".sidebar").classList.toggle("stow");
    document.querySelector(".sidebar").classList.toggle("full");
    document.querySelector(".stratContainer").classList.toggle("hideScroll");
    document.getElementById("togglebtn").classList.toggle("rotateToggle");

    const sidebarElement = document.querySelector('.sidebar');
    const sidebarState = sidebarElement.classList.contains('full');

    if (sidebarState) {
        document.getElementById("togglebtn").classList.add("rotateToggle");
    } else {
        document.getElementById("togglebtn").classList.remove("rotateToggle");
    }
}
    

//select strategy function

function selectStrategy(buttonId, templateUrl, strategyName) {
    const button = document.getElementById(buttonId);
    const saveUrl = templateUrl;
    button.addEventListener('click', async () => {
        const templateContent = await loadTemplate(templateUrl);
        renderStrategy(templateContent);
        sessionStorage.setItem("sidebarpath", saveUrl);
        sessionStorage.setItem("strategyName", strategyName);
        prepSidebar();
        accordion();
    });
}

function accordion(){
    var acc = document.getElementsByClassName("accordion");
    var i;
    
    for (i = 0; i < acc.length; i++) {
      acc[i].addEventListener("click", function() {
        this.classList.toggle("active");
        var panel = this.nextElementSibling;
        if (panel.style.maxHeight) {
          panel.style.maxHeight = null;
        } else {
          panel.style.maxHeight = panel.scrollHeight + "px";
        }
      });
    }
}

function searchStrategies () {
    const conceptMapSubjects = [ "All", "English", "Liberal Arts", "Humanities",  "Science"];
    const conceptMapTypes = ["All", "Test Prep", "Review", "Reading", "Homework Problems", "Lecture"];
    const cornellNotesSubjects = ["All", "English", "Humanities", "Math", "Science", "Social Studies"];
    const cornellNotesTypes = ["All", "Reading", "Test Prep", "Review", "Lecture", "Homework Problems"];
    const tChartsSubjects = ["All", "Math", "Science"];
    const tChartsTypes = ["All", "Homework Problems", "Lecture", "Test Prep", "Review"];
    const annotationSubjects = ["All", "English", "Humanities", "Science", "Social Studies"];
    const annotationTypes = ["All", "Reading", "Test Prep", "Review", "Homework Problems"];
    const homeworkAsTestSubjects = ["All", "Math", "Science", "Social Studies"];
    const homeworkAsTestTypes = ["All", "Test Prep", "Review", "Homework Problems"];
    const subject = sessionStorage.getItem("userSubject");
    const type = sessionStorage.getItem("userType");
    if (conceptMapSubjects.includes(subject) && conceptMapTypes.includes(type)) {
        document.getElementById("cMap").classList.add("show");
        handleButtonClick('showsidebarbutton1', 'strategies/conceptmaps.html');
        selectStrategy('selectStrategy1', 'strategies/conceptmaps.html', 'Concept Map');
    };
    if (cornellNotesSubjects.includes(subject) && cornellNotesTypes.includes(type)) {
        document.getElementById("cNote").classList.add("show");
        handleButtonClick('showsidebarbutton2', 'strategies/cornellnotes.html');
        selectStrategy('selectStrategy2', 'strategies/cornellnotes.html', 'Cornell Notes');
    }
    if (tChartsSubjects.includes(subject) && tChartsTypes.includes(type)) {
        document.getElementById("tChart").classList.add("show");
        handleButtonClick('showsidebarbutton4', 'strategies/tcharts.html');
        selectStrategy('selectStrategy4', 'strategies/tcharts.html','T-Chart');
    }
    
    if (homeworkAsTestSubjects.includes(subject) && homeworkAsTestTypes.includes(type)) {
        document.getElementById("hwt").classList.add("show");
        handleButtonClick('showsidebarbutton5', 'strategies/hwt.html');
        selectStrategy('selectStrategy5', 'strategies/hwt.html','Homework as a Test');
    }
    if (annotationSubjects.includes(subject) && annotationTypes.includes(type)) {
        document.getElementById("ann").classList.add("show");
        handleButtonClick('showsidebarbutton3', 'strategies/annotation.html');
        selectStrategy('selectStrategy3', 'strategies/annotation.html','Annotation');
    }        
}

function printGoal() {
    const printGoal = document.querySelector(".printGoal");
    const savedUserGoal = sessionStorage.getItem("userGoal"); 
               
    if (savedUserGoal) {
         printGoal.textContent = `${savedUserGoal}`;
    }
}

function printStrategy() {
    const printStrategyName = document.querySelector(".printStrategyName");
    const savedUserStrategy = sessionStorage.getItem("strategyName");
    printStrategyName.innerText = `${savedUserStrategy}`;
}

function printReflection () {
    const printSummary = document.querySelector(".printSummary");
    const savedSummary = sessionStorage.getItem("userSummary"); 
    const printReflection= document.querySelector(".printReflection");
    const savedReflection = sessionStorage.getItem("userReflection");
    const printClass = document.querySelector(".printClass");
    const savedClass = sessionStorage.getItem("userClass"); 
               
    if (savedSummary) {
         printSummary.textContent = `${savedSummary}`;
    }
    if (savedReflection) {
        printReflection.textContent = `${savedReflection}`;
   }
    if (savedClass) {
    printClass.textContent = `${savedClass}`;
}
}


function saveReflection(){
   
    const userSummary = sessionStorage.getItem("userSummary"); 
    const userReflection = sessionStorage.getItem("userReflection");
    const userClass = sessionStorage.getItem("userClass");
; 
               
    if (userSummary) {
         document.getElementById("userSummary").textContent = `${userSummary}`;
    }
    if (userReflection) {
        document.getElementById("userReflection").textContent = `${userReflection}`;
   }
   if (userClass) {
        document.getElementById("userClass").value = `${userClass}`;
    }
   
}


function checkGoalInStorage (){
    const savedUserGoal = sessionStorage.getItem("userGoal");   
    if (savedUserGoal) {
        document.getElementById("userGoal").textContent = `${savedUserGoal}`;
           
    }
}

function endSession () {
    sessionStorage.clear();
    document.querySelector(".sidebar").classList.add("hidden");
    document.querySelector(".sidebar").classList.add("stow");
}