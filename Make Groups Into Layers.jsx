//
// Make Groups into Layers
// v 0.1
// by John Pobojewski, 2014
//
//
// IN PROCESS

app.doScript (main, ScriptLanguage.JAVASCRIPT, undefined, UndoModes.entireScript, "Make Groups into Layers");

function main(){
	var d;
	var prefix;
	with(d = app.dialogs.add({name:"Make Groups into Layers"})){
		with(dialogColumns.add()){
			with(borderPanels.add()){
				with(dialogColumns.add()){
					staticTexts.add({staticLabel:"Layer Prefix:"});
					prefix = textEditboxes.add({editContents:""});
				}
			}
		}
	}
	var r = d.show();
	if (r == true){
		moveGroupsToLayers(prefix.editContents);
	}
}


function moveGroupsToLayers(prefix){
	var _sel = app.selection;

	for (var i=0; i<_sel.length; i++){
		var _obj = _sel[i];

		if (_obj.constructor==Group){
			var _layer  = app.activeDocument.layers.add();
			_layer.name = prefix + " " + _obj.id;
			_obj.move(_layer);
		}
	}
}
