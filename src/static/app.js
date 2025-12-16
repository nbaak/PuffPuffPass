let lastTimestamp = null;

const container = document.getElementById("container");
const toggleButton = document.getElementById("toggle");

function updateBlockBrightness() {
    const blocks = container.querySelectorAll(".block");
    blocks.forEach((block, index) => {
        const positionFromNewest = blocks.length - 1 - index;
        const brightness = Math.max(0.5, 1 - 0.1 * positionFromNewest);
        block.style.filter = `brightness(${brightness})`;
    });
}

function addBlock(action) {
    const block = document.createElement("div");
    block.classList.add("block");

    if (action === "Paff") block.classList.add("paff");
    else block.classList.add("pass");

    block.dataset.action = action;
    container.appendChild(block);

    updateBlockBrightness();

    // Keep stack centered, scroll if necessary
    container.scrollTo({
        top: container.scrollHeight / 2,
        left: container.scrollWidth / 2,
        behavior: "smooth"
    });
}

async function poll() {
    const response = await fetch("/last");
    const data = await response.json();

    if (!data.timestamp) return;

    if (data.timestamp !== lastTimestamp) {
        lastTimestamp = data.timestamp;
        addBlock(data.action);
    }
}

toggleButton.addEventListener("click", () => {
    if (container.classList.contains("vertical")) {
        container.classList.remove("vertical");
        container.classList.add("horizontal");
    } else {
        container.classList.remove("horizontal");
        container.classList.add("vertical");
    }
});

setInterval(poll, 1000);
