//
// Insert Incrementing Number
// v 0.1
// by John Pobojewski, 2014
//
//
// IN PROCESS

app.doScript (main, ScriptLanguage.JAVASCRIPT, undefined, UndoModes.entireScript, "Insert Incrementing Number");

function main(){
	var _sel = app.selection;

	for (var i=0; i<_sel.length; i++){
		var _obj = _sel[i];
		_obj.contents = "Wk " + (i+1);
	}
}
