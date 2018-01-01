'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import MyhexdumpContentProvider from './contentProvider'
import { Range, Selection } from 'vscode';

var find_str: string = "";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "multiline-find-and-replace" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable1 = vscode.commands.registerCommand('extension.setFind', () => {
        // The code you place here will be executed every time your command is executed


        // let provider = new MyhexdumpContentProvider();
        // let registration = vscode.workspace.registerTextDocumentContentProvider('myhexdump', provider);
        // let fileUri = vscode.Uri.file('dummy.myhexdump');
        // // add 'myhexdump' extension to assign an editorLangId
        // let hexUri = fileUri.with( {scheme: 'myhexdump'});

        // vscode.commands.executeCommand('vscode.open', hexUri, 2);
        let start = vscode.window.activeTextEditor.selection.start;
        let end = vscode.window.activeTextEditor.selection.end;
        let selection = vscode.workspace.textDocuments[0];
        find_str = selection.getText(new Range(start, end));

    });
    context.subscriptions.push(disposable1);

    let disposable2 = vscode.commands.registerCommand('extension.findNext', () => {
        let selection = vscode.workspace.textDocuments[0];
        let start = selection.offsetAt(vscode.window.activeTextEditor.selection.start) + 1;
        let match = selection.getText().indexOf(find_str, start);

        if (match >= 0) {
            let match_start = selection.positionAt(match);
            let match_end = selection.positionAt(match + find_str.length);
            vscode.window.activeTextEditor.selection = new Selection(match_start, match_end);
        } else {
            vscode.window.showInformationMessage("End of file reached: No Matches");
        }

    });
    context.subscriptions.push(disposable2);
}

// this method is called when your extension is deactivated
export function deactivate() {
    vscode.window.showInformationMessage('My app deactivated');
}