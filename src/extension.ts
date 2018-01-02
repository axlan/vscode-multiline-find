'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { Range, Selection, TextEditorEdit } from 'vscode';

const escapeStringRegexp = require('escape-string-regexp');

var find_str: string = "";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('"multiline-find-and-replace" is now active!');

    function runCommandOnSelection(cmd) {
        let selection = vscode.window.activeTextEditor.selection
        let active_doc = vscode.workspace.textDocuments[0];
        let selected_txt = active_doc.getText(new Range(selection.start, selection.end));
        var new_line:string = "\n"
        if (active_doc.eol == 2) {
            new_line = "\r\n"
        }
        let escaped_str = escapeStringRegexp(selected_txt).replace(new RegExp(new_line, 'g'), "\\n");
        console.log(escaped_str);
        vscode.window.activeTextEditor.edit(editBuilder => {
            editBuilder.replace(selection, escaped_str);
        });
        cmd(escaped_str);
        vscode.window.activeTextEditor.show()
        // undo or do another replace?
        //vscode.commands.executeCommand('undo');
        vscode.commands.executeCommand('undo');
        // vscode.window.activeTextEditor.edit(editBuilder => {
        //     editBuilder.replace(vscode.window.activeTextEditor.selection, selected_txt);
        // });
    }

    let disposable1 = vscode.commands.registerCommand('multilinefind.multiLineFind', () => {
        // How to only toggle on?
        // Could add text run find and check, but super hacky
        // vscode.commands.executeCommand('toggleFindRegex');
        runCommandOnSelection((escaped_str)=>{
            let selection = vscode.window.activeTextEditor.selection
            // TODO: Try find and see if the selection moves to determine if regex is on or not
            // Need to make sure regex is disabled since findWithSelection sanatizes \n
            vscode.commands.executeCommand('actions.findWithSelection');
            //vscode.commands.executeCommand('editor.action.nextMatchFindAction');
        })
    });
    context.subscriptions.push(disposable1);

    let disposable2 = vscode.commands.registerCommand('multilinefind.copyAsRegex', () => {
        runCommandOnSelection((escaped_str)=>{
            vscode.commands.executeCommand('editor.action.clipboardCopyAction');
        })
    });
    context.subscriptions.push(disposable2);
}

// this method is called when your extension is deactivated
export function deactivate() {
    vscode.window.showInformationMessage('My app deactivated');
}