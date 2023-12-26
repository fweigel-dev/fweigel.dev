document.addEventListener("DOMContentLoaded", () => {
    const terminalWindow = document.getElementById("terminal");
    const terminalIcon = document.querySelector(".terminal-icon");

    terminalIcon.addEventListener('mousedown', e => {
        terminalWindow.classList.remove('minimized')
        terminalIcon.classList.add('active', 'open')
    });


    const videoIcon = document.querySelector(".video-icon");

    videoIcon.addEventListener('mousedown', e => {
        window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", '_blank');
    });



});


