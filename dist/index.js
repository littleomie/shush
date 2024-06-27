/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 753:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 982:
/***/ ((module) => {

module.exports = eval("require")("ssh2");


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
const core = __nccwpck_require__(753);
const { Client } = __nccwpck_require__(982);

const main = async () => {
    try {
        const host = core.getInput('host', { required: true });
        const user = core.getInput('user', { required: true });
        const password = core.getInput('password', { required: false });
        const port = core.getInput('port', { required: false });
        const key = core.getInput('key', { required: false });
        const passphrase = core.getInput('passphrase', { required: false });
        const commands = core.getInput('commands', { required: true });

        const credentials = {
            host: host,
            user: user,
            port: port,
        };

        if (password) {
            credentials.password = password;
        }

        if (key) {
            credentials.privateKey = key;
        }

        if (passphrase) {
            credentials.passphrase = passphrase;
        }

        const conn = new Client();

        conn.on('ready', () => {
            console.log('Successfully connected');

            let output = '';

            function executeNextCommand(commands) {
                if (commands.length === 0) {
                    conn.end();
                    core.setOutput('output', output);
                    return;
                }

                const command = commands.shift();

                conn.exec(command, (err, stream) => {
                    if (err) {
                        core.setFailed(err.message);
                        return;
                    }

                    stream.on('close', (code) => {
                        output += `\nCommand '${command}' exited with code ${code}\n`;
                        executeNextCommand(commands);
                    }).on('data', (data) => {
                        output += data.toString();
                    }).stderr.on('data', (data) => {
                        output += data.toString();
                    });
                });
            }

            executeNextCommand(commands.split('\n'));
        }).on('error', (err) => {
            core.setFailed(err.message);
        }).connect(credentials);
    } catch (error) {
        core.setFailed(error.message);
    }
}

main();
})();

module.exports = __webpack_exports__;
/******/ })()
;