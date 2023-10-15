const typingText = document.querySelector(".typing-text p"),
inpField = document.querySelector(".wrapper .input-field"),
timeTag = document.querySelector(".time span b"),
mistakeTag = document.querySelector(".mistake span"),
wpmTag = document.querySelector(".wpm span");

let timer,
maxTime = 10,
timeLeft = maxTime,
charIndex = mistakes = isTyping = 0;

// initionaize text in input contaner 
function loadParagraph() {
    // pick a random value based on paragraph length
    const ranIndex = Math.floor(Math.random() * paragraphs.length);
    typingText.innerHTML = "";

    // split every charactr and insert input .typig-text p
    paragraphs[ranIndex].split("").forEach(char => {
        let span = `<span>${char}</span>`
        typingText.innerHTML += span;
    });

    // add active to current character
    typingText.querySelectorAll("span")[0].classList.add("active");

    // focus to input
    document.addEventListener("keydown", () => inpField.focus());
    typingText.addEventListener("click", () => inpField.focus());
}

function initTyping() {
    let characters = typingText.querySelectorAll("span");
    let typedChar = inpField.value.split("")[charIndex];

    if(charIndex < characters.length - 1 && timeLeft > 0) {

        if(!isTyping) {
            timer = setInterval(initTimer, 1000);
            isTyping = true;
        }
        if(typedChar == null) {
            if(charIndex > 0) {
                charIndex--;
                // if char is labeled incorrect - 1 mistake
                if(characters[charIndex].classList.contains("incorrect")) {
                    mistakes--;
                }
                characters[charIndex].classList.remove("correct", "incorrect");
            }
        } 
        else {
            // if char is correct 
            if(characters[charIndex].innerText == typedChar) {
                characters[charIndex].classList.add("correct");

            } 
            // if char is wrong 
            else {
                mistakes++;
                characters[charIndex].classList.add("incorrect");
            }
            charIndex++;
        }
        characters.forEach(span => span.classList.remove("active"));
        characters[charIndex].classList.add("active");

        // calc vpm 
        let wpm = Math.round(((charIndex - mistakes)  / 5) / (maxTime - timeLeft) * 60);
        
        wpmTag.innerText = wpm;
        mistakeTag.innerText = mistakes;
    }
}
let wpm;

function initTimer() {
    if(timeLeft > 0) {
        timeLeft--;
        timeTag.innerText = timeLeft;
        wpm = Math.round(((charIndex - mistakes)  / 5) / (maxTime - timeLeft) * 60);
        wpmTag.innerText = wpm;
        return wpm;
    } else {
        
        saveData();
        showTopUsers();
        clearInterval(timer);
    }
}

function saveData() {

    let username = prompt("Username :");
    // if input empty = Guest
    if(!username){username = "Guest";}
    let score = wpm;

    localStorage.setItem(username, score);
    
}
function showTopUsers() {
    var users = [];
    // Iterate through all items in local storage
    for (var i = 0; i < localStorage.length; i++) {
        var username = localStorage.key(i);
        var score = parseInt(localStorage.getItem(username));

        // Add user object to the array
        users.push({ username: username, score: score });
    }

    // Sort the users array based on score in descending order
    users.sort(function(a, b) {
        return b.score - a.score;
    });

    // Get the top 10 users
    var topUsers = users.slice(0, 10);

    // Display the top 10 users
    var message = "Top 10 Users:\n";
    for (var j = 0; j < topUsers.length; j++) {
        message += (j + 1) + ". " + topUsers[j].username + " - " + topUsers[j].score + "\n";
    }

    alert(message);
}


loadParagraph();
inpField.addEventListener("input", initTyping);