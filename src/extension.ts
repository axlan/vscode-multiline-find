'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import MyhexdumpContentProvider from './contentProvider'
import { Range, Selection, TextEditorEdit } from 'vscode';

const escapeStringRegexp = require('escape-string-regexp');

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

        vscode.commands.executeCommand('actions.findWithSelection', find_str);

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
        cmd();
        vscode.window.activeTextEditor.show()
        // undo or do another replace?
        //vscode.commands.executeCommand('undo');
        vscode.commands.executeCommand('undo');
        // vscode.window.activeTextEditor.edit(editBuilder => {
        //     editBuilder.replace(vscode.window.activeTextEditor.selection, selected_txt);
        // });
    }

    let disposable3 = vscode.commands.registerCommand('extension.multiLineFind', () => {
        // How to only toggle on?
        // Could add text run find and check, but super hacky
        // vscode.commands.executeCommand('toggleFindRegex');
        runCommandOnSelection(()=>{vscode.commands.executeCommand('undo');})
    });
    context.subscriptions.push(disposable3);

    let disposable4 = vscode.commands.registerCommand('extension.copyAsRegex', () => {
        runCommandOnSelection(()=>{vscode.commands.executeCommand('editor.action.clipboardCopyAction');})
    });
    context.subscriptions.push(disposable4);
}

// this method is called when your extension is deactivated
export function deactivate() {
    vscode.window.showInformationMessage('My app deactivated');
}