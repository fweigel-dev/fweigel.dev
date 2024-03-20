const fileSystem = {
    root: {
        name: '/',
        children: {
            etc: {
                name: 'etc',
                parent: '/',
                children: {
                    'passwd': 'User account information.',
                    'shadow': 'Secure user account information.',
                    'hosts': 'Host names and IP addresses.',
                },
            },
            home: {
                name: 'home',
                parent: '/',
                children: {
                    user: {
                        name: 'user',
                        parent: 'home',
                        children: {
                            'file1.txt': 'Content of file1.txt',
                            'file2.txt': 'Content of file2.txt',
                        },
                    },
                },
            },
            var: {
                name: 'var',
                parent: '/',
                children: {
                    log: {
                        name: 'log',
                        parent: 'var',
                        children: {
                            'syslog': 'System log file.',
                            'auth.log': 'User authentication log.',
                        },
                    },
                },
            },
            usr: {
                name: 'usr',
                parent: '/',
                children: {
                    bin: {
                        name: 'bin',
                        parent: 'usr',
                        children: {
                            'python': 'Python interpreter.',
                            'node': 'Node.js runtime.',
                        },
                    },
                    lib: {
                        name: 'lib',
                        parent: 'usr',
                        children: {},
                    },
                },
            },
            dev: {
                name: 'dev',
                parent: '/',
                children: {
                    'null': 'Null device, discards all input.',
                    'zero': 'Zero device, produces null bytes when read.',
                },
            },
        },
    },
};

let currentDirectory = fileSystem.root.children.home.children.user;


const commands = {
    help: function () {
        return `
Welcome to Fabian's Command Line
Version 2023.12

List of Available Commands:
<span class="highlight-command">help</span> - Displays this ultra-helpful message
<span class="highlight-command">info fweigel</span> - It's all about me. Surprise!
<span class="highlight-command">social</span> - Stalk me online, but in a nice way!
<span class="highlight-command">brewJava</span> - Brews a virtual cup of Java. Warning: Might be too hot!
<span class="highlight-command">clear</span> - Wipe your screen clean
<span class="highlight-command">other</span> - Try other some linux commands
`;
    },

    brewJava: function () {
        const coffeeArt = `
      ( (
       ) )
    ........
    |      |]
    \\      /
     \`----'
    `;
        return `
Brewing a virtual cup of Java... ☕

Please wait...
Your coffee is ready!

${coffeeArt}

Enjoy your freshly brewed code-enhancing beverage!
    `;
    },

    info: function (username) {
        if (username === 'fweigel') {
            return '👋 Hey, I\'m Fabian an apprentice developer from Germany.';
        } else if (username === undefined) {
            return 'Whoops! You forgot to type a username.';
        } else {
            return `Hmm, "${username}"... Nope, doesn't ring a bell.`;
        }
    },

    social: function () {
        const socialMediaProfiles = [{
            name: 'GitHub', url: 'https://github.com/Ferox-Stylo', icon: 'fab fa-github'
        },
            // Add more profiles as needed
        ];

        const buttonsDiv = document.createElement('div');
        buttonsDiv.className = 'button-group';

        socialMediaProfiles.forEach(profile => {
            const button = document.createElement('button');
            button.className = 'social-button';

            const icon = document.createElement('i');
            icon.className = `${profile.icon}`;
            button.appendChild(icon);

            const text = document.createTextNode(` ${profile.name}`);
            button.appendChild(text);

            button.onclick = () => window.open(profile.url, '_blank');
            buttonsDiv.appendChild(button);
        });

        const messageElement = document.createElement('div');
        messageElement.className = 'welcome-message';
        messageElement.textContent = 'Find me on social media!';

        return {messageElement, buttonsDiv};
    },

    clear: function () {
        const dynamicContent = document.getElementById('dynamic-content');
        const terminalInput = document.getElementById('terminal-input');

        // Temporarily remove the input element to avoid it being cleared
        const inputParent = terminalInput.parentNode;
        inputParent.removeChild(terminalInput);

        // Clear all content
        while (dynamicContent.firstChild) {
            dynamicContent.removeChild(dynamicContent.firstChild);
        }

        // Re-append the input element
        dynamicContent.appendChild(terminalInput);

        return 'Poof! Everything is gone. (Don\'t worry, it\'s supposed to do that)';
    },
    whoami: function () {
        return 'You are you, unless you\'ve been body-swapped recently.';
    },
    other: function () {
        return 'Surprise! This command does... absolutely nothing. But you can try standard some linux commands.';
    },
    vi: function () {
        return '<span class="highlight-command">vi</span> not installed. try <span class="highlight-command">emacs</span>.';
    },
    emacs: function () {
        return '<span class="highlight-command">emacs</span> not installed. try <span class="highlight-command">vim</span>.';
    },
    vim: function () {
        return '<span class="highlight-command">vim</span> not installed. try <span class="highlight-command">nano</span>.';
    },
    nano: function () {
        return '<span class="highlight-command">nano</span> not installed. try <span class="highlight-command">vi</span>.';
    },
    cd: function (dir) {
        if (dir === '..') {
            if (currentDirectory.parent) {
                let parentPath = currentDirectory.parent.split('/');
                let parent = fileSystem.root;
                for (let i = 1; i < parentPath.length; i++) {
                    parent = parent.children[parentPath[i]];
                }
                currentDirectory = parent;
                return `Changed directory to ${currentDirectory.name}`;
            } else {
                return 'Already at root directory.';
            }
        } else if (currentDirectory.children[dir]) {
            currentDirectory = currentDirectory.children[dir];
            return `Changed directory to ${dir}`;
        } else {
            return `Directory "${dir}" not found.`;
        }
    },

    ls: function () {
        return Object.keys(currentDirectory.children).join('\n');
    },

    rm: function (flag, name) {
        if (flag === '-r') {
            const item = currentDirectory.children[name];
            if (item) {
                delete currentDirectory.children[name];
                return `Removed ${name}`;
            } else {
                return `File or directory "${name}" not found.`;
            }
        } else {
            const item = currentDirectory.children[flag];
            if (item) {
                if (typeof item === 'string') {
                    delete currentDirectory.children[flag];
                    return `Removed file ${flag}`;
                } else {
                    return `Cannot remove "${flag}": Is a directory`;
                }
            } else {
                return `File "${flag}" not found.`;
            }
        }
    },

};


export {commands, currentDirectory};
