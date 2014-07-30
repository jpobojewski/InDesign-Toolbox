//
// Count Items
// v 1.5
// by John Pobojewski
//
// Counts items that are selected and alerts result
//


app.doScript (main, ScriptLanguage.JAVASCRIPT, undefined, UndoModes.entireScript, "Count Items");

function main(){
	//Make certain that user interaction (display of dialogs, etc.) is turned on.
	app.scriptPreferences.userInteractionLevel = UserInteractionLevels.interactWithAll;
	if (app.documents.length != 0){
		if (app.activeWindow.activeSpread.pageItems.length != 0){
			run();
		}
		else {
			alert("The active spread does not contain any page items.");
		}
	}
	else{
		alert("No documents are open. Please open a document and try again.");
	}
}

function run(){

	var _doc = app.activeDocument;
	var _sel = app.selection;

	if (_sel.length > 0){
		alert("You have " + _sel.length + " items selected.");
	} else {
		alert("Please select some items to count.");
	}
}