const typingText = document.querySelector(".typing-text p"),
inpField = document.querySelector(".wrapper .input-field"),
tryAgainBtn = document.querySelector(".content-box button"),
timeTag = document.querySelector(".time span b"),
mistakeTag = document.querySelector(".mistake span"),
wpmTag = document.querySelector(".wpm span");

let timer,
maxTime = 10,
timeLeft = maxTime,
charIndex = mistakes = isTyping = 0;

function loadParagraph() {
    const ranIndex = Math.floor(Math.random() * paragraphs.length);
    typingText.innerHTML = "";
    paragraphs[ranIndex].split("").forEach(char => {
        let span = `<span>${char}</span>`
        typingText.innerHTML += span;
    });
    typingText.querySelectorAll("span")[0].classList.add("active");
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
                if(characters[charIndex].classList.contains("incorrect")) {
                    mistakes--;
                }
                characters[charIndex].classList.remove("correct", "incorrect");
            }
        } else {
            if(characters[charIndex].innerText == typedChar) {
                characters[charIndex].classList.add("correct");
            } else {
                mistakes++;
                characters[charIndex].classList.add("incorrect");
            }
            charIndex++;
        }
        characters.forEach(span => span.classList.remove("active"));
        characters[charIndex].classList.add("active");

        let wpm = Math.round(((charIndex - mistakes)  / 5) / (maxTime - timeLeft) * 60);
        wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;
        
        wpmTag.innerText = wpm;
        mistakeTag.innerText = mistakes;
    } else {
        clearInterval(timer);
        inpField.value = "";
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
        
        // FIXME betulkan kenapa takboleh run sambil typing
        // let timeDelay = 5000; 
        // setTimeout(saveData(), timeDelay);
        // console.log("thi")
        saveData();
        clearInterval(timer);
    }
}

function saveData() {

      let username = prompt("Username :")

        if(!username){
            username = "Guest";
        }
        console.log(username)
        // Retrieve existing data from session storage
        var data = JSON.parse(sessionStorage.getItem("userInputs")) || [];

        console.log(wpm)
        let value = wpm;
        // Add the new user input to the data array
        data.push({ username: username, value: value });

        // Store the updated data in session storage
        sessionStorage.setItem("userInputs", JSON.stringify(data));

        // Display all the user inputs using prompt
        var displayText = "";
        for (var i = 0; i < data.length; i++) {
            displayText += "Username: " + data[i].username + ", Value: " + data[i].value + "\n";
        }
        alert(displayText);
    }


loadParagraph();
inpField.addEventListener("input", initTyping);