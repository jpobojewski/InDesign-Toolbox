//
// Make Groups into Layers
// v 0.1
// by John Pobojewski, 2014
//
//
// IN PROCESS

app.doScript (main, ScriptLanguage.JAVASCRIPT, undefined, UndoModes.entireScript, "Make Groups into Layers");

function main(){
	var _sel = app.selection;
	app.selection = NothingEnum.NOTHING;

	for (var i=0; i<_sel.length; i++){
		var _obj = _sel[i];
		app.select( _obj );

		if (_obj.constructor==Group){
			var _layer  = app.activeDocument.layers.add();
			var s = nameLayer(_obj);
			if (s != null){
				_layer.name = s;
				_obj.move(_layer);	
			}
		}

		app.selection = NothingEnum.NOTHING;
	}
}

function nameLayer(_obj){
	var d, prefix;
	with(d = app.dialogs.add({name:"Make Groups into Layers"})){
		with(dialogColumns.add()){
			with(borderPanels.add()){
				with(dialogColumns.add()){
					staticTexts.add({staticLabel:"Group Name:"});
					prefix = textEditboxes.add({editContents:""});
				}
			}
		}
	}
	var r = d.show();
	if (r == true){
		return prefix.editContents;
	}
}
