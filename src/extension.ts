// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import AlExtensions = require("./AlExtensions");
import { exit } from 'process';
import AlObject = require('./AlObject');
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed


export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "al-extension-description" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('al-extension-description.generate-extension-report', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		try {
			console.log('start search al files');
			var AlExts = new AlExtensions();
			Promise.all;
			console.debug(AlExts);
			AlExts.writeAllDescriptionFile();
		} catch (error) {
			console.log(error);
			
		}
		
	});

	context.subscriptions.push(disposable);
	let disposable2 = vscode.commands.registerCommand('al-extension-description.generate-api', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		try {
			console.log('Transform current Page to API');
			let path = vscode.window.activeTextEditor?.document.uri.fsPath;
			console.log(path);
			let object = new AlObject(path as string);
			Promise.all;
			AlObject.WriteApiFile(object);
			
		} catch (error) {
			console.log(error);
			
		}
		
	});

	context.subscriptions.push(disposable2);
}

// this method is called when your extension is deactivated
export function deactivate() {}
