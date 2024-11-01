// script.js
const terminalOutput = document.getElementById('terminal-output');
const commandInput = document.getElementById('command-input');

const commands = [
    "Initializing DJ Portfolio...",
    "Loading assets...",
    "Connecting to database...",
    "Fetching user data...",
    "Launching website...",
    "DJ Portfolio is now live! 🎉"
];

let commandIndex = 0;

function typeCommand(command) {
    return new Promise(resolve => {
        let index = 0;
        const interval = setInterval(() => {
            terminalOutput.innerHTML += command[index];
            index++;
            if (index === command.length) {
                clearInterval(interval);
                resolve();
            }
        }, 50); // Speed of typing
    });
}

async function runCommands() {
    for (const command of commands) {
        await typeCommand(command);
        terminalOutput.innerHTML += '\n'; // New line after each command
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait before next command
    }
    // After all commands are run, clear the input and redirect or show the main content
    commandInput.style.display = 'none'; // Hide the input
    terminalOutput.innerHTML += '\nDone! Redirecting to portfolio...';
    setTimeout(() => {
        window.location.href = 'https://dikshantjangra.github.io/DikshantJangra/frontend/index.html'; // Change to your portfolio URL
    }, 3000); // Wait before redirecting
}

// Start the command simulation
runCommands();