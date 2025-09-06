/**
 * COMP 4537 – Lab 0
 * Memory Game
 * 
 * Note: Some parts of this code were developed with the assistance of ChatGPT.
 */

/**
 * Button class
 * - move position
 * - show and hide the number
 */
class Button {
    /* Constructor */
    constructor(number, color) {
        this.number = number;
        this.color = color;
        this.btn = document.createElement("button");
        this.btn.classList.add("memory-btn");
        this.btn.style.backgroundColor = color;
        this.btn.textContent = number;
        this.disableButton();
    }

    /* List of methods */
    setLocation(top, left) {
        this.btn.style.position = "absolute";
        this.btn.style.top = `${top}px`;
        this.btn.style.left = `${left}px`;
    }

    showNumber() {
        this.btn.textContent = this.number;
    }

    hideNumber() {
        this.btn.textContent = "";
    }

    enableButton() {
        this.btn.disabled = false;
    }

    disableButton() {
        this.btn.disabled = true;
    }

}



/**
 * Game class
 * - to start game (press GO)
 * - spawn the buttons
 * - clear the buttons
 * 
 * Note: I use chatGPT to help me with the logic of methods i need to create and also to check if my code is clean enough
 */
class Game {
    constructor(gameBoard, gameManager) {
        this.gameBoard = gameBoard;
        this.arrayButtons = [];
        this.order = [];
        this.currentIndex = 0;
        this.gameManager = gameManager;
    }

    startGame(n) {
        this.reset();
        this.createButtons(n);

        for (let i = 0; i < this.arrayButtons.length; i++) {
            this.order.push(this.arrayButtons[i].number);
        }

        this.arrayButtons.forEach(b => {
            b.disableButton();
            b.btn.onclick = null;
        });

        setTimeout(() => this.mixOrder(n), n * 1000);
    }

    reset() {
        this.gameBoard.innerHTML = "";
        this.arrayButtons = [];
        this.order = [];
        this.currentIndex = 0;
    }

    createButtons(n) {
        const colors = this.randomColors(n)
        for (let i = 1; i <= n; i++) {
            const button = new Button(i, colors[i - 1]);
            this.gameBoard.appendChild(button.btn); // difference between append and appendChild --> appendChild can only accept a single node object
            this.arrayButtons.push(button);

        }
    }

    randomColors(n) {
        const colors = [];
        for (let i = 0; i < n; i++) {
            const hue = Math.floor((360 / n) * i); // make sure that the hue value always unique
            colors.push(`hsl(${hue}, 70%, 50%)`);
        }
        return colors;
    }

    mixOrder(totalTimes) {
        let counter = 0;
        // mixInterval returns an ID which can be used to clearInterval
        const mixInterval = setInterval(() => {

            const boardWidth = this.gameBoard.clientWidth;
            const boardHeight = this.gameBoard.clientHeight;

            this.arrayButtons.forEach(btn => {
                const btnWidth = btn.btn.offsetWidth;
                const btnHeight = btn.btn.offsetHeight;

                const maxTop = boardHeight - btnHeight;
                const maxLeft = boardWidth - btnWidth;

                const top = Math.random() * Math.max(0, maxTop);
                const left = Math.random() * Math.max(0, maxLeft);
                btn.setLocation(top, left);

                btn.disableButton();               // ⬅️ still not clickable while scrambling
                btn.btn.onclick = null;
            });

            counter++;
            if (counter === totalTimes) {
                clearInterval(mixInterval);
                this.startGuess();
            }
        }, 2000);
    }

    startGuess() {
        this.arrayButtons.forEach((btn, i) => {
            btn.hideNumber();
            btn.enableButton();
            btn.btn.onclick = () => this.checkGuess(btn, i);
        })
    }

    checkGuess(btn) {
        const correctAnswer = this.order[this.currentIndex];
        if (btn.number === correctAnswer) {
            btn.showNumber();
            this.currentIndex++;
            if (this.currentIndex === this.order.length) {
                alert(MESSAGES.correctOrder);
                this.gameManager.enableStart();
            }
        } else {
            alert(MESSAGES.wrongOrder);
            this.arrayButtons.forEach(btn => btn.showNumber());
            this.gameManager.enableStart();
        }
    }

}

/**
 * Manager class (to manage the the Game elements and its Button)
 */
class GameManager {
    constructor() {
        this.gameBoard = document.getElementById("gameBoard");
        this.startButton = document.getElementById("startButton");
        this.input = document.getElementById("numButtons");
        this.game = new Game(this.gameBoard, this);
        this.startButton.addEventListener("click", () => {
            this.handleStart()
        })
    }

    handleStart() {
        const n = parseInt(this.input.value, 10); // convert string to integer if its 10.
        if (n < 3 || n > 7) {
            alert(MESSAGES.invalidInput);
        } else {
            this.startButton.disabled = true;
            this.game.startGame(n);
        }
    }

    // the purpose of this method is to enable/disable the GO button
    enableStart() {
        this.startButton.disabled = false;
    }
}

new GameManager();