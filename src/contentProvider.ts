'use strict';

import * as vscode from 'vscode';
import * as fs from 'fs';

export default class FindContentProvider implements vscode.TextDocumentContentProvider {

    private static s_instance: FindContentProvider = null;
    private _onDidChange = new vscode.EventEmitter<vscode.Uri>();

    constructor() {
        if(FindContentProvider.s_instance) {
            FindContentProvider.s_instance.dispose();
        }
        FindContentProvider.s_instance = this;
    }

    static get instance() {
        return FindContentProvider.s_instance;
    }

    public dispose() {
        this._onDidChange.dispose();
        if(FindContentProvider.s_instance) {
            FindContentProvider.s_instance.dispose();
            FindContentProvider.s_instance = null;
        }
    }

    public provideTextDocumentContent(uri: vscode.Uri): Thenable<string> {

        return new Promise( async (resolve) => {
            return resolve(uri.fragment);
        });
    }

    get onDidChange(): vscode.Event<vscode.Uri> {
        return this._onDidChange.event;
    }

    public update(uri: vscode.Uri) {
        this._onDidChange.fire(uri);
    }
}