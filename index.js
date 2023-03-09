window.addEventListener("load", main);
window.addEventListener("resize", resizeFields);

let fieldValues = [];
let currentPlayer = 1;


function main() {
    
    initGame();

}


function initGame() {
    const GAME_LAYOUT = document.getElementById("game");
    const BUTTON = document.createElement("button");
    
    BUTTON.innerHTML += "Indítás";
    BUTTON.id = "start-BTN";

    BUTTON.addEventListener("click", startGame);

    GAME_LAYOUT.appendChild(BUTTON);
}

function startGame() {
    const GAME_LAYOUT = document.getElementById("game");
    const BUTTON = document.getElementById("start-BTN");
    const GAME_FOOTER = document.getElementById("gameFooter");
    
    GAME_LAYOUT.innerHTML = "";
    generateFields(GAME_LAYOUT);


    GAME_FOOTER.innerHTML = "Játékos 1";
}


function generateFields(GAME_LAYOUT) {
    fieldValues = [];
    for (let i = 0; i < 3; i++) {
        fieldValues[i] = [];
        for (let j = 0; j < 3; j++) {
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
    let fieldWidth = gameBoxWidth / 3 - (4 * 2) - (2 * 4 / 3);
    //console.log(fieldWidth);

    for (let i = 0; i < FIELDS.length; i++) {
        let field = FIELDS[i];
        field.style.width = `${fieldWidth}px`; 
        //console.log(field.style.width);
        field.style.height = field.style.width;
    }

}

function fieldClick() {
    const GAME_LAYOUT = document.getElementById("game");
    const GAME_FOOTER = document.getElementById("gameFooter");
    let id = this.id.split("-");
    let i = parseInt(id[0]), j = parseInt(id[1]);

    if (fieldValues[i][j] != "") {return false;}
    
    fieldValues[i][j] = currentPlayer == 1 ? "x" : "o";
    
    //console.log(fieldValues);
    refreshFields();
    let hasWinner = checkWinner();

    if (hasWinner) {
        showWinAlert(GAME_LAYOUT);
        return;
    }

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

function showWinAlert(GAME_LAYOUT){
    {/* <div id="winAlert">
        Játékos 1 nyert
        <button id="start-BTN">Újrakezdés</button>
    </div> */}
    const WIN_BOX = document.createElement("div");
    const BUTTON = document.createElement("button");

    WIN_BOX.id = "winAlert";
    WIN_BOX.innerHTML += `Játékos ${currentPlayer} nyert!`

    BUTTON.innerHTML = "Újrakezdés";
    BUTTON.id = "start-BTN";
    BUTTON.addEventListener("click", startGame); //initGame

    WIN_BOX.appendChild(BUTTON);
    GAME_LAYOUT.appendChild(WIN_BOX);
}

function checkWinner() {
    return has3InRow() || has3InColumn() || has3InX();
}

function has3InRow() {
    let has3 = false;
    let i = 0, j = 0;

    while(i < fieldValues.length && !has3) {
        let nextEachOther = 0;
        j = 0;
        let firstColumn = fieldValues[i][j];

        while((j < fieldValues[i].length) && (nextEachOther == j) && (nextEachOther <= 3)) {
            nextEachOther += (firstColumn != "" && firstColumn == fieldValues[i][j]) ? 1 : 0;
            j++;
        }
        has3 = nextEachOther == 3;
        i++;
    }

    return has3;
}

function has3InColumn() {
    let has3 = false;
    let i = 0, j = 0;

    while(i < fieldValues[j].length && !has3) {
        let nextEachOther = 0;
        let firstRow = fieldValues[j][i];

        while((j < fieldValues.length) && (nextEachOther == j) && (nextEachOther <= 3)) {
            nextEachOther += (firstRow != "" && firstRow == fieldValues[j][i]) ? 1 : 0;
            j++;
        }
        has3 = nextEachOther == 3;
        i++;
        j = 0;
    }

    return has3;
}

function has3InX() {
    let has3 = false;
    let i = 0, j = 0;
    while (i < fieldValues.length && !has3) {
        let nextEachOther = 0;
        let firstField = fieldValues[0][0];
        j = 0;
        while((j < fieldValues.length) && (nextEachOther == j) && (nextEachOther <= 3)) {
            //if (j >= fieldValues.length || j >= fieldValues[j].length) {continue;}
            nextEachOther += (firstField != "" && firstField == fieldValues[j][j]) ? 1 : 0;
            j++;
        }
        i++;
        has3 = nextEachOther == 3;
    }

    return has3;
}