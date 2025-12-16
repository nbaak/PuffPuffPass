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

function addBlock(action, timestamp) {
    const block = document.createElement("div");
    block.classList.add("block");

    if (action === "Paff") block.classList.add("paff");
    else block.classList.add("pass");

    // Add both action and timestamp to dataset
    block.dataset.action = `${action} (${timestamp})`;

    // Append normally to keep correct tower order
    container.appendChild(block);

    // Animate falling from above into its position
    block.style.transform = "translateY(-150px)";
    block.style.opacity = "0";
    block.style.transition = "transform 0.6s ease-out, opacity 0.6s ease-out";

    requestAnimationFrame(() => {
        block.style.transform = "translateY(0)";
        block.style.opacity = "1";
    });

    updateBlockBrightness();

    // Scroll to top to show newest block if needed
    container.scrollTop = 0;
}


async function poll() {
    const response = await fetch("/last");
    const data = await response.json();

    if (!data.timestamp) return;

    if (data.timestamp !== lastTimestamp) {
        lastTimestamp = data.timestamp;
        addBlock(data.action, data.timestamp);
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

    if (horizontalline.classList.contains("vertical")) {
        horizontalline.classList.remove("vertical")
        horizontalline.classList.add("horizontal")
    } else {
        horizontalline.classList.remove("horizontal")
        horizontalline.classList.add("vertical")
    }

    if (verticalline.classList.contains("vertical")) {
        verticalline.classList.remove("vertical")
        verticalline.classList.add("horizontal")
    } else {
        verticalline.classList.remove("horizontal")
        verticalline.classList.add("vertical")
    }
});

setInterval(poll, 1000);
