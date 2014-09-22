//
// Export Layers to PDFs
// v 0.1
// by John Pobojewski, 2014
//
//
// IN PROCESS

app.doScript (main, ScriptLanguage.JAVASCRIPT, undefined, UndoModes.entireScript, "Export Layers to PDFs");

function main(){
	var _doc = app.activeDocument;

	var folder = Folder.selectDialog("Choose Output Folder");

	if (folder != null){
		for (var a=0; a<_doc.layers.length; a++){
			for (var b=0; b<_doc.layers.length; b++){
				_doc.layers[b].visible = false;
			}
			_doc.layers[a].visible = true;
			_doc.asynchronousExportFile(ExportFormat.PDF_TYPE, folder.fsName + "/" + _doc.layers[a].name + ".pdf");
		}	

		// turn everything back on again	
		for (var c=0; c<_doc.layers.length; c++){
			_doc.layers[c].visible = true;
		}

		alert("Complete!");
	}
}