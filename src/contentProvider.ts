'use strict';

import * as vscode from 'vscode';
import * as fs from 'fs';
import { sprintf } from 'sprintf-js';


export default class MyHexdumpContentProvider implements vscode.TextDocumentContentProvider {

    private static s_instance: MyHexdumpContentProvider = null;
    private _onDidChange = new vscode.EventEmitter<vscode.Uri>();

    constructor() {
        if(MyHexdumpContentProvider.s_instance) {
            MyHexdumpContentProvider.s_instance.dispose();
        }
        MyHexdumpContentProvider.s_instance = this;
    }

    static get instance() {
        return MyHexdumpContentProvider.s_instance;
    }

    public dispose() {
        this._onDidChange.dispose();
        if(MyHexdumpContentProvider.s_instance) {
            MyHexdumpContentProvider.s_instance.dispose();
            MyHexdumpContentProvider.s_instance = null;
        }
    }

    public provideTextDocumentContent(uri: vscode.Uri): Thenable<string> {
        const config = vscode.workspace.getConfiguration('myhexdump');
        const hexLineLength = config['width'] * 2;
        const firstByteOffset = config['showAddress'] ? 10 : 0;
        const lastByteOffset = firstByteOffset + hexLineLength + hexLineLength / config['nibbles'] - 1;
        const firstAsciiOffset = lastByteOffset + (config['nibbles'] == 2 ? 4 : 2);
        const lastAsciiOffset = firstAsciiOffset + config['width'];
        const charPerLine = lastAsciiOffset + 1;
        const sizeWarning = config['sizeWarning'];
        const sizeDisplay = config['sizeDisplay'];

        return new Promise( async (resolve) => {
            let hexyFmt = {
                format      : config['nibbles'] == 8 ? 'eights' :
                            config['nibbles'] == 4 ? 'fours' :
                            'twos',
                width       : config['width'],
                caps        : config['uppercase'] ? 'upper' : 'lower',
                numbering   : config['showAddress'] ? "hex_digits" : "none",
                annotate    : config['showAscii'] ? "ascii" : "none",
                length      : sizeDisplay
            };

            let header = config['showOffset'] ? this.getHeader() : "";
            header += "01 10"
            let tail = '(Reached the maximum size to display. You can change "myhexdump.sizeDisplay" in your settings.)';

            let hexString = header;

            return resolve(hexString);
        });
    }

    get onDidChange(): vscode.Event<vscode.Uri> {
        return this._onDidChange.event;
    }

    public update(uri: vscode.Uri) {
        this._onDidChange.fire(uri);
    }

    private getHeader(): string {
        const config = vscode.workspace.getConfiguration('myhexdump');
        let header = config['showAddress'] ? "  Offset: " : "";

        for (var i = 0; i < config['width']; ++i) {
            header += sprintf('%02X', i);
            if ((i+1) % (config['nibbles'] / 2) == 0) {
                header += ' ';
            }
        }

        header += "\t\n";
        return header;
    }
}