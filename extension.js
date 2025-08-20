const vscode = require('vscode');
const cp = require('child_process');


async function getPythonPath() {
    const extension = vscode.extensions.getExtension('ms-python.python');
    if (!extension) {
        vscode.window.showErrorMessage("Python extension is not installed!");
        return 'python3';
    }

    if (!extension.isActive) {
        await extension.activate();
    }

    const pythonPath = await extension.exports.settings.getExecutionDetails().execCommand[0];
    return pythonPath || 'python3';
}

function activate(context) {
    let disposable = vscode.commands.registerCommand('ekl.runFile', async function () {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;

        const filePath = editor.document.fileName;

        // Use workspaceFolders instead of rootPath
        const workspaceFolder = vscode.workspace.workspaceFolders
            ? vscode.workspace.workspaceFolders[0].uri.fsPath
            : undefined;

        if (!workspaceFolder) {
            vscode.window.showErrorMessage("No workspace folder open.");
            return;
        }

        // Use python3 (or a full path) to run your interpreter
        const pythonCmd = await getPythonPath();

        let terminal = vscode.window.terminals.find(t => t.name === "Eukleia");
        if (!terminal) {
            terminal = vscode.window.createTerminal("Eukleia");
        }
        terminal.show();
        terminal.sendText(`${pythonCmd} "${workspaceFolder}/main.py" "${filePath}"`)
    });

    context.subscriptions.push(disposable);
}

exports.activate = activate;

