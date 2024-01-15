// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "go-builder-pattern-boilerplate" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('go-builder-pattern-boilerplate.generateBoilerplate', generateBoilerplate);

	context.subscriptions.push(disposable);
}

function generateBoilerplate() {
	const editor = vscode.window.activeTextEditor;

	if (editor == null) {
		return;
	}

	const selection = editor.selection;
	const text = editor.document.getText(selection).trim();
	const lines = text
		.split("\n")
		.filter(line => line.trim() !== "\n")
		.filter(line => line.trim().length > 0)
		.map(line => line.trim().replace(/\s+/g, ' '));

	if (!lines[0].startsWith("type") || !lines[0].endsWith("struct {") || lines[lines.length - 1].trim() !== "}") {
		vscode.window.showErrorMessage("You didn't select a Golang struct!")
		return;
	}

	const structName = lines[0].split(" ")[1].trim();

	editor.edit(editBuilder => {
		editBuilder.insert(selection.end, `\n${generateOptionType(structName)}`)

		for (const line of lines.slice(1, -1)) {
			const [attribute, dataType] = line.split(" ");
			editBuilder.insert(selection.end, generateWithFunction(structName, attribute, dataType))
		}

		editBuilder.insert(selection.end, `${generateBuildFunctions(structName)}`)
	});
}

function generateBuildFunctions(structName: string): string {
	const uncapitalizedStructName = structName[0].toLowerCase() + structName.slice(1);
	return `
func CreateDefault${structName}() ${structName} {
	return ${structName}{}
}

func Create${structName}(options ...${structName}Option) ${structName} {
	${uncapitalizedStructName} := CreateDefault${structName}()

	for _, option := range options {
		${uncapitalizedStructName} = option(${uncapitalizedStructName})
	}

	return ${uncapitalizedStructName}
}
	`
}

function generateOptionType(structName: string): string {
	return `
type ${structName}Option func(${structName}) ${structName}
	`
}

function generateWithFunction(structName: string, attribute: string, dataType: string): string {
	const uncapitalizedStructName = structName[0].toLowerCase() + structName.slice(1);
	const capitalizedAttribute = attribute[0].toUpperCase() + attribute.slice(1);
	const uncapitalizedAttribute = attribute[0].toLowerCase() + attribute.slice(1);
	const optionName = `${structName}Option`
	return `
func With${capitalizedAttribute}(${uncapitalizedAttribute} ${dataType}) ${optionName} {
	return func(${uncapitalizedStructName} ${structName}) ${structName} {
		${uncapitalizedStructName}.${attribute} = ${uncapitalizedAttribute}
		return ${uncapitalizedStructName}
	}
}
	`
}

// This method is called when your extension is deactivated
export function deactivate() { }
