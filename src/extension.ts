"use strict";
import * as vscode from "vscode";
import * as path from "path";
import diagnose from "./diagnostics";

export function activate(context: vscode.ExtensionContext) {

	const collection = vscode.languages.createDiagnosticCollection("test");
	if (vscode.window.activeTextEditor) {
		updateDiagnostics(vscode.window.activeTextEditor.document, collection);
	}
	context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(editor => {
		if (editor) {
			updateDiagnostics(editor.document, collection);
		}
	}));
}

function updateDiagnostics(document: vscode.TextDocument, collection: vscode.DiagnosticCollection): void {
	if (!document || !path.basename(document.uri.fsPath).includes(".package.ts")) {
		collection.clear();
		return
	}

	collection.set(document.uri, diagnose(document.getText()));
}