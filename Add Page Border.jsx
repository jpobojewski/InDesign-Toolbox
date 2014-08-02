//
// Add Page Border
// v 0.1
// by John Pobojewski, 2014
// based on work by Cari Jansen www.carijansen.com 2005
//
// Adds a page border on every master page on a separate FPO layer
//

app.doScript (main, ScriptLanguage.JAVASCRIPT, undefined, UndoModes.entireScript, "Add Page Border");

function main(){
	getDialog();
}

function getDialog(){
	var _doc = app.activeDocument;	
	var Dialog;

	with(Dialog = app.dialogs.add({name: "Add Page Border"})){
			with(dialogColumns.add()){
				with(borderPanels.add()){
					with(dialogColumns.add()){
						with(dialogRows.add()){
							staticTexts.add({staticLabel:"Stroke Weight:", minWidth: 50});				
							var _strokeWeight  = measurementEditboxes.add({editValue: 0.3,  editUnits:MeasurementUnits.points,  minWidth:100});
						}
						with(dialogRows.add()){
							staticTexts.add({staticLabel:"Stroke Type:", minWidth: 50});		
							var strokeStyleList = [];
						  	for (var i=0; i<_doc.strokeStyles.length; i++){
						  		strokeStyleList.push(_doc.strokeStyles.item(i).name);
						  	}
						  	var defaultStrokeIndex = _doc.strokeStyles.item("Solid").index;							  
							var _strokeStyleMenu = dropdowns.add({stringList:strokeStyleList, selectedIndex:defaultStrokeIndex, minWidth: 100});
						}
						with(dialogRows.add()){
							staticTexts.add({staticLabel:"Stroke Color:", minWidth: 50});				
							var colorList = [];
							for (var i=0; i<_doc.swatches.length; i++){
							  colorList.push(_doc.swatches.item(i).name);
							}
							var defaultSwatchIndex = _doc.swatches.item("Black").index;	
							var _colorMenu = dropdowns.add({stringList:colorList, selectedIndex:defaultSwatchIndex, minWidth: 100});
						}
					}			
				}
			}
		}
	myResult = Dialog.show();
	if (myResult == true){
		
		
		var strokeColor 	= _doc.swatches.item("Black"); 
		var noColor		    = _doc.swatches.item("None");
		var strokeType   	= _doc.strokeStyles.item("Solid");
		var strokeLayer		= _doc.layers.item("Page Border");

		// add stroke layer
		if (strokeLayer == null){
			strokeLayer		= _doc.layers.add();
			strokeLayer.move(LocationOptions.atBeginning, undefined);
			strokeLayer.name = "Page Border";  
		} else {
			// unlock it
			strokeLayer.locked = false;
		}

		// include it on every master page
		for (var i=0; i<_doc.masterSpreads.length; i++){
			for (var j=0; j<_doc.masterSpreads[i].pages.length; j++){
				var _pg 				= _doc.masterSpreads[i].pages.item(j);
				var _border				= _pg.rectangles.add();
				_border.itemLayer       = strokeLayer;
				_border.geometricBounds = _pg.bounds;
				
				_border.strokeWeight 	= parseFloat(_strokeWeight.editContents);   // in points
				_border.strokeType   	= _doc.strokeStyles.item( _strokeStyleMenu.stringList[_strokeStyleMenu.selectedIndex] );
				_border.strokeColor  	= _doc.swatches.item( _colorMenu.stringList[_colorMenu.selectedIndex] );
				_border.strokeTint   	= 100;  // in %
				
				_border.fillColor 		 = noColor;
				_border.strokeAlignment  = StrokeAlignment.insideAlignment;	
			}
		}

		// lock the made layer
		strokeLayer.locked = true;

		//Remove the dialog from memory.
		Dialog.destroy();

		alert("Complete!");
	}
	else{
		//Remove the dialog from memory.
		Dialog.destroy();
	}
}