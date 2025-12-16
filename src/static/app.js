let lastTimestamp = null;
let offsetY = 20;

function addBlock(action) {
    const block = document.createElement("div");
    block.classList.add("block");

    if (action === "Paff") {
        block.classList.add("paff");
    } else {
        block.classList.add("pass");
    }

    block.style.top = offsetY + "px";
    offsetY += 50;

    if (offsetY > window.innerHeight - 50) {
        offsetY = 20;
    }

    document.getElementById("container").appendChild(block);
}

async function poll() {
    const response = await fetch("/last");
    const data = await response.json();

    if (!data.timestamp) {
        return;
    }

    if (data.timestamp !== lastTimestamp) {
        lastTimestamp = data.timestamp;
        addBlock(data.action);
    }
}

setInterval(poll, 1000);
