// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

type GeneratorVersions = "v1" | "v2";

type Config = {
	generatorVersion: GeneratorVersions
}

let config: Config;

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
	config = vscode.workspace.getConfiguration("goBuilderPatternBoilerplate") as unknown as Config;
	const editor = vscode.window.activeTextEditor;

	if (editor === undefined) {
		return;
	}

	const selection = editor.selection;
	const text = editor.document.getText(selection).trim();

	if (text.length === 0) {
		vscode.window.showErrorMessage("You need to select text!");
		return;
	}

	const lines = text
		.split("\n")
		.filter(line => line.trim() !== "\n")
		.filter(line => line.trim().length > 0)
		.map(line => line.trim().replace(/\s+/g, ' '));

	if (!lines[0].startsWith("type") || !lines[0].endsWith("struct {") || lines[lines.length - 1].trim() !== "}") {
		vscode.window.showErrorMessage("You didn't select a Golang struct!");
		return;
	}

	const structName = lines[0].split(" ")[1].trim();

	editor.edit(editBuilder => {
		if (config.generatorVersion === "v1") {
			generateBoilerplateV1(editBuilder, selection, structName, lines);
		} else if (config.generatorVersion === "v2") {
			generateBoilerplateV2(editBuilder, selection, structName, lines);
		} else {
			vscode.window.showErrorMessage("Invalid generator version!");
		}
	});
}

function generateBoilerplateV1(editBuilder: vscode.TextEditorEdit, selection: vscode.Selection, structName: string, lines: string[]) {
	let code = `\n${generateOptionType(structName)}`;

	for (const line of lines.slice(1, -1)) {
		const lastSpaceIndex = line.lastIndexOf(" ");
		const dataType = line.substring(lastSpaceIndex + 1);
		const attributeString = line.substring(0, lastSpaceIndex);
		const attributes = attributeString.split(",").map(attribute => attribute.trim());

		for (const attribute of attributes) {
			code += generateWithFunctionV1(structName, attribute, dataType);
		}
	}

	code += generateBuildFunctions(structName);
	editBuilder.insert(selection.end, code);
}

function generateBoilerplateV2(editBuilder: vscode.TextEditorEdit, selection: vscode.Selection, structName: string, lines: string[]) {
	let code = "\n";

	for (const line of lines.slice(1, -1)) {
		const lastSpaceIndex = line.lastIndexOf(" ");
		const dataType = line.substring(lastSpaceIndex + 1);
		const attributeString = line.substring(0, lastSpaceIndex);
		const attributes = attributeString.split(",").map(attribute => attribute.trim());

		for (const attribute of attributes) {
			code += generateWithFunctionV2(structName, attribute, dataType);
		}
	}

	code += generateBuildFunction(structName);
	editBuilder.insert(selection.end, code);
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
`;
}

function generateOptionType(structName: string): string {
	return `
type ${structName}Option func(${structName}) ${structName}
	`;
}

function generateWithFunctionV1(structName: string, attribute: string, dataType: string): string {
	const uncapitalizedStructName = structName[0].toLowerCase() + structName.slice(1);
	const capitalizedAttribute = attribute[0].toUpperCase() + attribute.slice(1);
	const uncapitalizedAttribute = attribute[0].toLowerCase() + attribute.slice(1);
	const optionName = `${structName}Option`;
	return `
func With${capitalizedAttribute}(${uncapitalizedAttribute} ${dataType}) ${optionName} {
	return func(${uncapitalizedStructName} ${structName}) ${structName} {
		${uncapitalizedStructName}.${attribute} = ${uncapitalizedAttribute}
		return ${uncapitalizedStructName}
	}
}
`;
}

function generateWithFunctionV2(structName: string, attribute: string, dataType: string): string {
	const uncapitalizedStructName = structName[0].toLowerCase() + structName.slice(1);
	const capitalizedAttribute = attribute[0].toUpperCase() + attribute.slice(1);
	const uncapitalizedAttribute = attribute[0].toLowerCase() + attribute.slice(1);
	return `
func (${uncapitalizedStructName} *${structName}) With${capitalizedAttribute}(${uncapitalizedAttribute} ${dataType}) *${structName} {
	${uncapitalizedStructName}.${attribute} = ${uncapitalizedAttribute};
	return ${uncapitalizedStructName};
}
`;
}

function generateBuildFunction(structName: string): string {
	const uncapitalizedStructName = structName[0].toLowerCase() + structName.slice(1);
	return `
func (${uncapitalizedStructName} *${structName}) Build() ${structName} {
	return *${uncapitalizedStructName};
}

func Default${structName}() *${structName} {
	return &${structName}{}
}
`;
}

// This method is called when your extension is deactivated
export function deactivate() { }
