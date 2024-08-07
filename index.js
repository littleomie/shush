const core = require('@actions/core');
const { Client } = require('ssh2');

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
                        console.log(`\nCommand '${command}' exited with code ${code}\n`);
                        executeNextCommand(commands);
                    }).on('data', (data) => {
                        console.log(data.toString());
                    }).stderr.on('data', (data) => {
                        console.log(data.toString());
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