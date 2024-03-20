import { commands, currentDirectory } from "./commands.js";

document.addEventListener('DOMContentLoaded', () => {
    const elements = {
        commandInput: document.getElementById('command-input'),
        terminalWindow: document.getElementById('terminal-window'),
        dynamicContent: document.getElementById('dynamic-content'),
        terminal: document.getElementById('terminal'),
        terminalInput: document.getElementById('terminal-input'),
        terminalIcon: document.querySelector(".terminal-icon"),

    };

    let isDragging = false;
    let dragOffset = [0, 0];

    function initializeEventListeners() {
        elements.commandInput.addEventListener('keydown', handleCommandInputKeydown);
        document.addEventListener('keydown', focusOnCommandInput);
        elements.commandInput.addEventListener('input', scrollTerminalToEnd);
        elements.terminal.querySelector('header').addEventListener('mousedown', initiateDrag, true);
        document.addEventListener('mousemove', handleDrag, true);
        document.addEventListener('mouseup', endDrag, true);
        initializeControlButtonListeners();
    }

    function handleCommandInputKeydown(event) {
        if (event.key === 'Enter') {
            executeCommand(elements.commandInput.value);
            elements.commandInput.value = '';
        }
    }

    function focusOnCommandInput(event) {
        if (event.key.length === 1) {
            elements.commandInput.focus();
        }
    }

    function scrollTerminalToEnd() {
        elements.terminalWindow.scrollTop = elements.terminalWindow.scrollHeight;
    }

    function executeCommand(input) {
        const sanitizedInput = sanitizeInput(input);
        const [commandName, ...args] = sanitizedInput.split(' ');

        appendMessageToTerminal(`$ ${input}`, true);

        const commandFunction = commands[commandName];
        if (commandFunction) {
            const output = commandFunction(...args);
            handleCommandOutput(output);
        } else {
            appendMessageToTerminal(`Error: Command "${commandName}" not found.`);
        }

        appendMessageToTerminal(' ');
    }

    function handleCommandOutput(output) {
        if (output && output.messageElement && output.buttonsDiv) {
            appendElementToTerminal(output.messageElement);
            appendElementToTerminal(output.buttonsDiv);
        } else {
            appendMessageToTerminal(output);
        }
    }

    function appendElementToTerminal(element) {
        elements.dynamicContent.insertBefore(element, elements.terminalInput);
        element.scrollIntoView({behavior: 'smooth'});
    }

    function appendMessageToTerminal(message, isCommand = false) {
        const messageElement = document.createElement('div');
        messageElement.innerHTML = message;
        if (isCommand) {
            messageElement.classList.add('command');
        }
        appendElementToTerminal(messageElement);
    }

    function sanitizeInput(input) {
        return input.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function initializeControlButtonListeners() {
        const controlButtons = {
            'close-button': closeTerminal,
            'maximize-button': toggleFullScreen,
            'minimize-button': toggleTerminalMinimize,
        };

        Object.entries(controlButtons).forEach(([id, handler]) => {
            document.getElementById(id).addEventListener('click', handler);
        });
    }

    function closeTerminal() {
        elements.terminalIcon.classList.remove('active');
        elements.terminal.classList.remove('open');
        toggleTerminalMinimize();
    }

    function toggleTerminalMinimize() {
        clearTerminalContent();
        elements.terminalIcon.classList.remove('open');
        elements.terminal.classList.toggle('minimized');
    }

    function clearTerminalContent() {
        const content = elements.dynamicContent;
        while (content.firstChild) {
            content.removeChild(content.firstChild);
        }
        content.appendChild(elements.terminalInput);
    }

    function toggleFullScreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }

    function initiateDrag(event) {
        isDragging = true;
        const rect = elements.terminal.getBoundingClientRect();
        dragOffset = [event.clientX - rect.left, event.clientY - rect.top];
    }

    function handleDrag(event) {
        if (isDragging) {
            const newX = event.clientX - dragOffset[0] - 540;
            const newY = event.clientY - dragOffset[1] - 95;
            elements.terminal.style.left = `${newX}px`;
            elements.terminal.style.top = `${newY}px`;
        }
    }

    function endDrag() {
        isDragging = false;
    }

    initializeEventListeners();
});
