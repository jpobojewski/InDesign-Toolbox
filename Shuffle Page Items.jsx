//
// Shuffle Page Items
// v 1.0
// by John Pobojewski
//
// Randomly shuffles page items around
// Note: will move and resize all items on page!
//

app.doScript (main, ScriptLanguage.JAVASCRIPT, undefined, UndoModes.entireScript, "Shuffle Page Items");

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
	var _sel = app.selection;
	
	// init counter
	var _pos = new Array();
	for (var i = 0; i<_sel.length; i++){
		_pos.push( 0 );
	}
	
	// iterate
	for (i=0; i<_pos.length; i++){
		// pick two random values
		var a = i;
		var b = getRandomValue(_pos);	

		if (a != 1){
			try {
				// flip their assets
				var aBox = _sel[a];
				var bBox = _sel[b];
				var aPos = [aBox.geometricBounds[1], aBox.geometricBounds[0]];
				var bPos = [bBox.geometricBounds[1], bBox.geometricBounds[0]];

				bBox.move(aPos);
				aBox.move(bPos);
				
				// update counter
				_pos[a] = 1;
				_pos[b] = 1;
			} catch(e){

			}
		}
	}

	alert("Complete!");
}

function getRandomValue(data){
	var i = Math.round(Math.random()*data.length);	
	if (data[i] == 1){
		getRandomValue(data);
	} else {
		return i;
	}
}