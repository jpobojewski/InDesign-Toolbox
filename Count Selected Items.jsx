//
// Count Selected Items
// v 1.5
// by John Pobojewski
//
// Counts items that are selected and alerts result
//


app.doScript (main, ScriptLanguage.JAVASCRIPT, undefined, UndoModes.entireScript, "Count Selected Items");

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
		var myDialog = app.dialogs.add({name:"Count Selected Items", canCancel:false});
		with(myDialog){
			//Add a dialog column.
			with(dialogColumns.add()){
				with(borderPanels.add()){
					staticTexts.add({staticLabel:"You have "});
					with(dialogColumns.add()){
						textEditboxes.add({editContents:_sel.length+""});
					}
					with(dialogColumns.add()){
						staticTexts.add({staticLabel:" items selected."});
					}
				}
			}
		}
		myDialog.show();
		myDialog.destroy();	
	} else {
		alert("Please select some items to count.");
	}	
}