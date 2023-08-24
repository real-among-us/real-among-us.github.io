const role = document.querySelector("#role");
const players = document.querySelector("#players");
const addPlayerBTN = document.querySelector(".addPlayerBTN");
const playersInputText = document.querySelector(".playersInputText");
const playersContainer = document.getElementById("playersContainer");
const roleUl = document.querySelector("#roleUl");
const yourRoleTitle = document.querySelector("#yourRoleTitle");
const yourRole = document.querySelector("#yourRole");
const yourRoleShow = document.querySelector("#yourRoleShow");
let everyPlayers;

everyPlayers = decodeURIComponent(getCookie("players")).split(',');
let playersRole = JSON.parse(decodeURIComponent(getCookie("role")))

console.log(everyPlayers)
console.log(playersRole)

if (everyPlayers){
    for (var i = 0; i < everyPlayers.length; i++) {
        clickAddPlayerBTN().value = everyPlayers[i];
        var roleLi = document.createElement("li");
        roleLi.textContent = everyPlayers[i];
        roleUl.appendChild(roleLi);
    }

    if (playersRole){
        setupRole()
    }
}

// changing of players
function clickPlayersChangeBTN() {
    role.style.display = "none";
    players.style.display = "flex";
    yourRole.style.display = "none";
}

function clickAddPlayerBTN() {
    var input = document.createElement("input");
    input.type = "text";
    input.name = "name";
    playersContainer.appendChild(input);
    return input;
}

function clickSetPlayersBTN() {
    roleUl.innerHTML = ""; // Vyprázdníme obsah seznamu.
    var inputs = document.getElementsByName("name");
    var values = [];
    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].value.trim() !== "") {
            var roleLi = document.createElement("li");
            roleLi.textContent = inputs[i].value;
            roleUl.appendChild(roleLi);
            values.push(inputs[i].value);

        } else {
            inputs[i].parentNode.removeChild(inputs[i]);
            i--;
        }
    }

    

    role.style.display = "flex";
    players.style.display = "none";
    yourRole.style.display = "none";

    setCookie("players", values, 7);
    everyPlayers = values;
    console.log(everyPlayers)
}



function clickRoleGenerateBTN(){
    playersRole = {};
    let crewmates = [...everyPlayers];
    let impostors = [];

    // impostors
    for (var i = 0; i <= (everyPlayers.length * 2/7) - 1; i++) {
        // move player from crewmates to impostors
        let indexToMove = Math.floor(Math.random() * crewmates.length);
        playersRole[crewmates[indexToMove]] = "impostor";
        let movedItem = crewmates.splice(indexToMove, 1)[0];
        impostors.push(movedItem);
    }

    // cremwares role 70% for role
    for (var c = 0; c < crewmates.length; c++){
        // if 70%, you get some role
        if (Math.random() < 0.70) {
            whichRole = Math.floor(Math.random() * 4)
            if (whichRole === 0) {
                playersRole[crewmates[c]] = "detektiv";
            } else if (whichRole === 1) {
                playersRole[crewmates[c]] = "inženýr";
            } else if (whichRole === 2) {
                playersRole[crewmates[c]] = "hysterička";
            } else if (whichRole === 3) {
                playersRole[crewmates[c]] = "obr";
            }
        }
    }

    setCookie("role",JSON.stringify(playersRole),1)
    setupRole()
    console.log("crewmates:", crewmates);
    console.log("impostors:", impostors);
    console.log(playersRole)
}

// back to role after you show player role
function clickBackToRole(){
    role.style.display = "flex";
    players.style.display = "none";
    yourRole.style.display = "none";
}






function setupRole() {
    roleUl.innerHTML = ''
    for (let i = 0; i < everyPlayers.length; i++) {
        var roleLi = document.createElement("li");
        if (playersRole[everyPlayers[i]]) {
            roleLi.textContent = everyPlayers[i] + ' - ' + playersRole[everyPlayers[i]];
        } else {
            roleLi.textContent = everyPlayers[i] + ' - ' + "crewmate";
        }
        // if you want to show, who you are
        roleLi.addEventListener("click", (e) => {
            if (e.target.style.color === '') {
                e.target.style.color = 'green'
                yourRoleTitle.textContent = everyPlayers[i] + ', jsi'

                if (playersRole[everyPlayers[i]]) {
                    yourRoleShow.textContent = playersRole[everyPlayers[i]];
                    if (playersRole[everyPlayers[i]] === "detektiv") {
                        yourRoleShow.style.color = "green";
                    } else if (playersRole[everyPlayers[i]] === "inženýr") {
                        yourRoleShow.style.color = "gray";
                    } else if (playersRole[everyPlayers[i]] === "hysterička") {
                        yourRoleShow.style.color = "#fd627c";
                    } else if (playersRole[everyPlayers[i]] === "obr") {
                        yourRoleShow.style.color = "gold";
                    } else {
                        yourRoleShow.style.color = "red";
                    }
                } else {
                    yourRoleShow.textContent = 'crewmate';
                    yourRoleShow.style.color = "#00658d";
                }

                role.style.display = "none";
                players.style.display = "none";
                yourRole.style.display = "flex";
            } else if (e.target.style.color === 'green') {
                e.target.style.color = 'red'
            } else if (e.target.style.color === 'red') {
                e.target.style.color = 'green'
            }
        })
        roleUl.appendChild(roleLi);
    }
}


// cookies ********************************************************
function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == " ") c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0)
            return c.substring(nameEQ.length, c.length);
    }
    return null;
}
function setCookie(name, value, exdays) {
    let expires = "";
    if (exdays) {
        let date = new Date();
        date.setTime(date.getTime() + exdays * 24 * 60 * 60 * 1000);
        expires = "; expires=" + date.toUTCString();

    }
    document.cookie = name + "=" + (encodeURIComponent(value) || "") + expires + "; path=/";
}