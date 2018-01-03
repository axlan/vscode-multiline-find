'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { Range, Selection, TextEditorEdit } from 'vscode';

const escapeStringRegexp = require('escape-string-regexp');

var find_str: string = "";

var replace_str: string = "";

function get_selected_text(doc, selection) {
    return doc.getText(new Range(selection.start, selection.end));
}

function get_escaped_str(txt) {
    var escaped_str:string = escapeStringRegexp(txt);
    escaped_str = escaped_str.replace(new RegExp("\r", 'g'), "\\r");
    escaped_str = escaped_str.replace(new RegExp("\n", 'g'), "\\n");
    return escaped_str;
}

function multiLineFind() {
    if (find_str.length == 0 ) {
        vscode.window.showInformationMessage("No Find Text Set");
        return;
    }
    let selection = vscode.window.activeTextEditor.selection;
    let active_doc = vscode.window.activeTextEditor.document;
    let end_offset = active_doc.offsetAt(selection.end);
    let match = active_doc.getText().indexOf(find_str, end_offset);
    if (match >= 0) {
        let match_start = active_doc.positionAt(match);
        let match_end = active_doc.positionAt(match + find_str.length);
        vscode.window.activeTextEditor.selection = new Selection(match_start, match_end);
    } else {
        vscode.window.showInformationMessage("End of file reached: No Matches");
    }
}

function multiLineFindWithSelection() {
    let selection = vscode.window.activeTextEditor.selection;
    let active_doc = vscode.window.activeTextEditor.document;
    let selected_txt = get_selected_text(active_doc, selection);
    if (selected_txt.length == 0) {
        if (find_str.length == 0) {
            return;
        }
    } else {
        find_str = selected_txt;
    }
    return multiLineFind();
}


function multiLineReplaceFindNext() {
    if (replace_str.length == 0 ) {
        vscode.window.showInformationMessage("No Replace Text Set");
        return;
    }
    let selection = vscode.window.activeTextEditor.selection;
    let active_doc = vscode.window.activeTextEditor.document;
    let selected_txt = get_selected_text(active_doc, selection);
    if (find_str == selected_txt) {
        vscode.window.activeTextEditor.edit(editBuilder => {
            editBuilder.replace(selection, replace_str);
        }).then(value => {
            if (value) {
                multiLineFind();
            }
       });
    }
}


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('"multiline-find-and-replace" is now active!');


    let disposable0 = vscode.commands.registerCommand('multilinefind.multiLineFind', () => {
        multiLineFind();
    });
    context.subscriptions.push(disposable0);

    let disposable1 = vscode.commands.registerCommand('multilinefind.multiLineFindWithSelection', () => {
        multiLineFindWithSelection();
    });
    context.subscriptions.push(disposable1);

    let disposable2 = vscode.commands.registerCommand('multilinefind.copyAsRegex', () => {
        let selection = vscode.window.activeTextEditor.selection;
        let active_doc = vscode.window.activeTextEditor.document;
        let selected_txt = get_selected_text(active_doc, selection);
        let escaped_str = get_escaped_str(selected_txt)
        vscode.window.activeTextEditor.edit(editBuilder => {
            editBuilder.replace(selection, escaped_str);
        });
        vscode.commands.executeCommand('editor.action.clipboardCopyAction');
        // undo or do another replace?
        //vscode.commands.executeCommand('undo');
        vscode.commands.executeCommand('undo');
        // vscode.window.activeTextEditor.edit(editBuilder => {
        //     editBuilder.replace(vscode.window.activeTextEditor.selection, selected_txt);
        // });
    });
    context.subscriptions.push(disposable2);

    let disposable3 = vscode.commands.registerCommand('multilinefind.multiLineSetReplace', () => {
        let selection = vscode.window.activeTextEditor.selection;
        let active_doc = vscode.window.activeTextEditor.document;
        let selected_txt = get_selected_text(active_doc, selection);
        if (selected_txt.length > 0) {
            replace_str = get_selected_text(active_doc, selection);
        }
    });
    context.subscriptions.push(disposable3);

    let disposable4 = vscode.commands.registerCommand('multilinefind.multiLineReplaceFindNext', () => {
        multiLineReplaceFindNext();
    });
    context.subscriptions.push(disposable4);

    let disposable5 = vscode.commands.registerCommand('multilinefind.multiLineReplaceAll', () => {
        if (replace_str.length == 0 ) {
            vscode.window.showInformationMessage("No Replace Text Set");
            return;
        }
        if (find_str.length == 0 ) {
            vscode.window.showInformationMessage("No Find Text Set");
            return;
        }
        let active_doc = vscode.window.activeTextEditor.document;
        let replaced_txt = active_doc.getText().replace(new RegExp(find_str, 'g'), replace_str);
        vscode.window.activeTextEditor.edit(editBuilder => {
            editBuilder.replace(new Range(0, 0, active_doc.lineCount, 0), replaced_txt);
        });
    });
    context.subscriptions.push(disposable5);
}

// this method is called when your extension is deactivated
export function deactivate() {
    vscode.window.showInformationMessage('My app deactivated');
}