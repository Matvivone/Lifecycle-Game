const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");

//ONBOARDIN (FEAR!)

const segmentsName = ["FEAR", "SURPRISE", "ANGER", "DISAPPOINTMENT", "LOVE", "HAPPINESS", "FEAR", "SURPRISE", "ANGER", "DISAPPOINTMENT", "LOVE", "HAPPINESS"];
// const colors = ["#FF5733", "#FF6B19", "#ED1C24", "#F3E500", "#FF66AD", "#4095E1", "#FF5733", "#FF6B19", "#ED1C24", "#F3E500", "#FF66AD", "#4095E1"];

const segmentsColors = {
    FEAR: {
        text: "white",
        background: "#FF5733",
    },
    SURPRISE: {
        text: "white",
        background: "#FF6B19",
    },
    ANGER: {
        text: "white",
        background: "#ED1C24",
    },
    DISAPPOINTMENT: {
        text: "black",
        background: "#F3E500",
        font: "bold 20px Arial"
    },
    LOVE: {
        text: "white",
        background: "#FF66AD",
    },
    HAPPINESS: {
        text: "white",
        background: "#4095E1",
    },
}

let startAngle = 0;
const arcSize = (2 * Math.PI) / segmentsName.length;
let spinAngle = 0;
let spinning = false;
let outcomeIndex = 1; // Index for predetermined outcome

const outcomes = [3, 3, 3, 3, 3, 3]; // FEAR = 3

let lastPickerPosition = null; // To detect segment "touch"

// Picker bounce function
function bouncePicker() {
    const picker = document.getElementById("picker");
    picker.style.top = "18px"; // Moves the picker upward slightly
    picker.style.color = "FF5F00";

    setTimeout(() => {
        picker.style.top = "20px"; // Return picker to normal position after bounce
    }, 100);
}

// Draw the wheel
function drawWheel() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(spinAngle); // Rotación de la ruleta
    ctx.translate(-canvas.width / 2, -canvas.height / 2);

    const radius = canvas.width / 2 * 0.9;

    for (let i = 0; i < segmentsName.length; i++) {
        const angle = startAngle + i * arcSize;


        ctx.beginPath();
        ctx.fillStyle = segmentsColors[segmentsName[i]].background;
        ctx.moveTo(canvas.width / 2, canvas.height / 2);
        ctx.arc(canvas.width / 2, canvas.height / 2, radius, angle, angle + arcSize);
        ctx.fill();
        ctx.closePath();


        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(angle + arcSize / 2);
        ctx.textAlign = "center";
        ctx.fillStyle = segmentsColors[segmentsName[i]].text;
        ctx.font = segmentsColors[segmentsName[i]]?.font ?? "bold 25px Arial";
        ctx.fillText(segmentsName[i], radius * 0.6, 10);
        ctx.restore();
    }

    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0, 2 * Math.PI);
    ctx.lineWidth = 10;
    ctx.strokeStyle = "#FFFFFF";
    ctx.stroke();
    ctx.closePath();

    ctx.restore();
}


// Spin the wheel to the predetermined outcome
function spinWheel() {
    if (spinning) return; // Prevent multiple clicks while spinning
    spinning = true;

    const selectedOutcome = outcomes[outcomeIndex];
    //outcomeIndex = (outcomeIndex + 1) % outcomes.length; 
// Cycle through the outcomes
    outcomeIndex = (outcomeIndex + 1) % outcomes.length; 

    const spinDuration = 3000; // Spin for 3 seconds
    const totalSpins = 5 * Math.PI; // Spin multiple times before stopping

    // Calculate final angle based on the predetermined outcome
    const finalAngle = selectedOutcome * arcSize - arcSize / 2;

    const spin = setInterval(() => {
        spinAngle += 0.1; // Spin speed
        drawWheel();

        // Calculate the current position of the picker relative to the wheel
        const pickerPosition = Math.floor(((spinAngle % (2 * Math.PI)) + 2 * Math.PI) / arcSize) % segmentsName.length;

        // If picker "touches" a new segment, make it bounce
        if (pickerPosition !== lastPickerPosition) {
            bouncePicker();
            lastPickerPosition = pickerPosition;
        }

        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(spinAngle);
        ctx.restore();
    }, 10);

    setTimeout(() => {
        clearInterval(spin);

        // Smooth stop at the selected outcome
        const stopSpin = setInterval(() => {
            if (spinAngle % (2 * Math.PI) > finalAngle && spinAngle % (2 * Math.PI) < finalAngle + 0.2) {
                console.log("en if")
                const modal = document.getElementById("modal");
                const modalTitle = document.querySelector(".modal-title");
                const modalOption = document.querySelector(".modal-option");

                clearInterval(stopSpin);
                spinning = false;
                modalTitle.textContent = `The wheel landed on`;
                modalOption.textContent = `${segmentsName[selectedOutcome - 3]}!`;
                
                modal.classList.add("modal-show");
            }
            spinAngle += 0.01; // Slower rotation during stop
            drawWheel();

            // Check the picker position again for smooth stop
            const pickerPosition = Math.floor(((spinAngle % (2 * Math.PI)) + 2 * Math.PI) / arcSize) % segmentsName.length;
            if (pickerPosition !== lastPickerPosition) {
                bouncePicker();
                lastPickerPosition = pickerPosition;
            }

            ctx.save();
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate(spinAngle);
            ctx.restore();
        }, 10);
    }, spinDuration);
}

// Draw the wheel initially
drawWheel();

const handleModal = () => {
    const modal = document.getElementById("modal");
    modal.classList.remove("modal-show");
}

document.getElementById("spinButton").addEventListener("click", spinWheel);
document.getElementById("closeModal").addEventListener("click", handleModal);
