window.addEventListener("load", main);
window.addEventListener("resize", resizeFields);

let fieldValues = [];
let currentPlayer;
let gameSize = 3;


function main() {
    
    initGame();

}


function initGame() {
    const GAME_LAYOUT = document.getElementById("game");
    const BUTTON = document.createElement("button");
    const BUTTON_3X3 = document.getElementById("3xGame");
    const BUTTON_5X5 = document.getElementById("5xGame");
    
    BUTTON.innerHTML += "Indítás";
    BUTTON.id = "start-BTN";

    BUTTON.addEventListener("click", startGame);
    BUTTON_3X3.addEventListener("click", function(){
        gameSize = 3;
        startGame();
    });
    BUTTON_5X5.addEventListener("click", function(){
        gameSize = 5;
        startGame();
    });

    GAME_LAYOUT.appendChild(BUTTON);
}

function startGame() {
    const GAME_LAYOUT = document.getElementById("game");
    const BUTTON = document.getElementById("start-BTN");
    const GAME_FOOTER = document.getElementById("gameFooter");
    
    currentPlayer = 1;
    GAME_LAYOUT.innerHTML = "";
    generateFields(GAME_LAYOUT);


    GAME_FOOTER.innerHTML = "Játékos 1";
}


function generateFields(GAME_LAYOUT) {
    fieldValues = [];
    for (let i = 0; i < gameSize; i++) {
        fieldValues[i] = [];
        for (let j = 0; j < gameSize; j++) {
            const FIELD = document.createElement("div");
            FIELD.id = `${i}-${j}`;
            FIELD.classList.add("field");
            FIELD.addEventListener("click", fieldClick);
            GAME_LAYOUT.appendChild(FIELD);
            fieldValues[i][j] = "";
        }
    }
    resizeFields();
}

function resizeFields() {
    if (window.innerWidth <= 340) {return false;}
    const GAME_LAYOUT = document.getElementById("game");
    const FIELDS = document.getElementsByClassName("field");
    
    if (FIELDS.length == 0) {
        return false;
    }

    let gameBoxWidth = getComputedStyle(GAME_LAYOUT).width;
    gameBoxWidth = parseFloat(gameBoxWidth.split("px")[0]);
    let fieldWidth = gameBoxWidth / gameSize - (4 * 2) - (2 * 4 / gameSize);
    //console.log(fieldWidth);

    for (let i = 0; i < FIELDS.length; i++) {
        let field = FIELDS[i];
        field.style.width = `${fieldWidth}px`; 
        //console.log(field.style.width);
        field.style.height = field.style.width;
    }

}

function fieldClick() {
    const GAME_FOOTER = document.getElementById("gameFooter");
    let id = this.id.split("-");
    let i = parseInt(id[0]), j = parseInt(id[1]);

    if (fieldValues[i][j] != "") {return false;}
    
    fieldValues[i][j] = currentPlayer == 1 ? "x" : "o";
    
    //console.log(fieldValues);
    refreshFields();
    if (checkWinner()) {return false;}

    currentPlayer = currentPlayer == 1 ? 2 : 1;
    GAME_FOOTER.innerHTML = `Játékos ${currentPlayer}`;

}

function refreshFields() {
    for (let i = 0; i < fieldValues.length; i++) {
        for (let j = 0; j < fieldValues[i].length; j++) {
            const FIELD = document.getElementById(`${i}-${j}`);
            const FIELDS_IMAGE = fieldValues[i][j];

            if (FIELDS_IMAGE == "") {continue;} 

            FIELD.style.background = `url("imgs/${FIELDS_IMAGE}.png")`;
            FIELD.style.backgroundSize = "cover";
            FIELD.style.backgroundPosition = "center";
            //console.log(FIELD.style.background);
        }
    }

}

function showWinAlert(GAME_LAYOUT, player = -1){
    {/* <div id="winAlert">
        Játékos 1 nyert
        <button id="start-BTN">Újrakezdés</button>
    </div> */}
    const WIN_BOX = document.createElement("div");
    const BUTTON = document.createElement("button");

    WIN_BOX.id = "winAlert";
    WIN_BOX.innerHTML += player != -1 ? `Játékos ${player} nyert!` : "Döntetlen!";

    BUTTON.innerHTML = "Újrakezdés";
    BUTTON.id = "start-BTN";
    BUTTON.addEventListener("click", startGame); //initGame

    WIN_BOX.appendChild(BUTTON);
    GAME_LAYOUT.appendChild(WIN_BOX);
}

function hasEmptyField() {
    let i = 0, j = 0;
    let van = false;

    while (i < fieldValues.length && !van) {
        j = 0;

        while (j < fieldValues[i].length && fieldValues[i][j] != "") {
            j++;
        }
        van = j < fieldValues[i].length;
        i++;
    }
    return i <= fieldValues.length && j < fieldValues[i-1].length;
}

function checkWinner() {
    const GAME_LAYOUT = document.getElementById("game");
    let hasWinner = has3InRow() || has3InColumn() || has3InX() || has3InXReverse();

    if (hasWinner) {
        showWinAlert(GAME_LAYOUT, currentPlayer);
        return true;
    }
    if (!hasEmptyField()) {
        showWinAlert(GAME_LAYOUT);
        return true;
    }
    return false;
}

function has3InRow() {
    let has3 = false;
    let nextEachOther = 0;
    let i = 0, j = 0, k = 0;

    while (i < fieldValues.length && !has3) {
        j = 0;
        
        while ((j < fieldValues.length) && (!has3)) {
            let firstColumn = fieldValues[i][j];
            nextEachOther = 0;
            k = 0;

            while ((j + k < fieldValues[i].length) && (nextEachOther <= 3) && (firstColumn != "")) {
                nextEachOther += (firstColumn == fieldValues[i][j + k]) ? 1 : 0;
                k++;
            }
            j++;
            has3 = nextEachOther == 3;
        }
        i++;
    }

    return has3;
}

function has3InColumn() {
    let has3 = false;
    let i = 0, j = 0, k = 0;
    let nextEachOther = 0;

    while (i < fieldValues.length && !has3) {
        j = 0;
        while ((j < fieldValues[i].length) && (!has3)) {
            let firstRow = fieldValues[i][j];
            nextEachOther = 0;
            k = 0;

            while ((i + k < fieldValues.length) && (nextEachOther <= 3) && (firstRow != "")) {
                nextEachOther += (firstRow == fieldValues[i+k][j]) ? 1 : 0;
                k++;
            }
            j++;
            //console.log(nextEachOther);
            has3 = nextEachOther == 3;
        }
        i++;
    }

    return has3;
}

function has3InX() {
    let has3 = false;
    let i = 0, j = 0, k = 0;

    while (i < fieldValues.length && !has3) {
        j = 0;
        while ((j < fieldValues.length) && !has3) {
            let nextEachOther = 0;
            let firstField = fieldValues[i][j];
            k = 0;
            
            while ((i+k < fieldValues.length) && (j+k < fieldValues[i].length) && (nextEachOther <= 3) && (firstField != "")){

                nextEachOther += (firstField == fieldValues[i+k][j+k]) ? 1 : 0;
                k++;
            }
            j++;
            has3 = nextEachOther == 3;
        }
        i++;
    }

    return has3;
}

function has3InXReverse() {
    let has3 = false;
    let i = 0, j = 0, k = 0;

    while (i < fieldValues.length && !has3) {
        j = 0;
        while ((j < fieldValues.length) && !has3) {
            let nextEachOther = 0;
            let firstField = fieldValues[i][j];
            k = 0;
            
            while ((i-k >= 0) && (j+k < fieldValues[i].length) && (nextEachOther <= 3) && (firstField != "")){

                nextEachOther += (firstField == fieldValues[i-k][j+k]) ? 1 : 0;
                k++;
            }
            j++;
            has3 = nextEachOther == 3;
        }
        i++;
    }

    return has3;
}

