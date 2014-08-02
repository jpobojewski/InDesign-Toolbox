//
// Create Guides Around Container
// v 1.0
// by John Pobojewski, 2009
//
// Plots guides within a selected shape's perimeter
//

app.doScript (main, ScriptLanguage.JAVASCRIPT, undefined, UndoModes.entireScript, "Create Guides Around Container");

function main(){
	var _doc = app.activeDocument;
	var _sel = app.selection;

	var numRows = 0;
	var numColumns = 0;
	var rowGutter = 0;
	var columnGutter = 0;
	var activeGuideColor = UIColors.gray;

	if (app.selection.length > 0){
		if (app.selection.length == 1){
			openDialog();
		} else {
			alert("Please select only 1 perimeter object for the grid to be composed within and rerun the script." );
		}
	} else {
		alert("Please select 1 perimeter object for the grid to be composed within and rerun the script." );
	}
}

function drawGuidesAroundObject(){
	// alert(numRows + '\n' + numColumns + '\n' + rowGutter + '\n' + columnGutter);
	var perimeter   = app.selection[0];
	var bounds      = perimeter.geometricBounds;	
	var gridX       = bounds[1];
	var gridY       = bounds[0];
	var gridWidth   = bounds[3]-bounds[1];
	var gridHeight  = bounds[2]-bounds[0];
	var rowHeight   = (gridHeight - (rowGutter*(numRows-1)))/numRows;
	var columnWidth = (gridWidth  - (columnGutter*(numColumns-1)))/numColumns;
	
	// draw rows
	var activeX = gridY;
	
	for (var i=0; i<=numRows; i++){
		if (i == 0 || i == numRows){
			var activeGutter = 0;
			drawGuide(activeX, 0);
		} else {
			activeGutter = rowGutter;
			drawGuide(activeX, 0);
			drawGuide(activeX + rowGutter, 0);			
		};	
		activeX += activeGutter + rowHeight;
	};
	
	// draw columns
	var activeY = gridX;
	for (var i=0; i<=numColumns; i++){
		if (i == 0 || i == numColumns){
			var activeGutter = 0;
			drawGuide(activeY, 1);
		} else {
			activeGutter = columnGutter;
			drawGuide(activeY, 1);
			drawGuide(activeY + columnGutter, 1);			
		};	
		activeY += activeGutter + columnWidth;
	};
}

function drawGuide(myGuideLocation, myGuideOrientation){
//	alert(myGuideLocation);

	with(app.activeWindow.activePage){ 
	//Place guides at the margins of the page. 
		if(myGuideOrientation == 0){
			guides.add(undefined, {orientation:HorizontalOrVertical.horizontal, location:myGuideLocation, guideColor:activeGuideColor}); 
		} else {
			guides.add(undefined, {orientation:HorizontalOrVertical.vertical, location:myGuideLocation, guideColor:activeGuideColor}); 
		}
	}
}

function openDialog(){;
	var dialog = app.dialogs.add({name:"Create Guides Around Container"});
	var colorStrings = ["lightBlue",
	"red",
	"green", 
	"blue", 
	"yellow", 
	"magenta",
	"cyan",
	"gray",
	"black",
	"orange",
	"darkGreen",
	"teal", 
	"tan",
	"brown",
	"violet",
	"gold",
	"darkBlue",
	"pink",
	"lavender",
	"brickRed"];

	with (dialog){
		with(dialogColumns.add()){
			with(dialogRows.add()){
				with(dialogColumns.add()){
        		    with(borderPanels.add()){
						staticTexts.add({staticLabel:"Rows:", minWidth:60});
        		        var numRowsBox = realEditboxes.add({editValue:1});
        		        staticTexts.add({staticLabel:"Gutter:"});
        		        var rowGutterBox = realEditboxes.add({editValue:0.125});
					}	
				}
			}
			with(dialogRows.add()){	
				with(dialogColumns.add()){
        		    with(borderPanels.add()){
						staticTexts.add({staticLabel:"Columns:"});
        		        var numColumnsBox = realEditboxes.add({editValue:1});
        		        staticTexts.add({staticLabel:"Gutter:"});
        		        var columnGutterBox = realEditboxes.add({editValue:0.125});
					}	
				}
			}
			with(dialogRows.add()){
				with(borderPanels.add()){
					var colorMenu = dropdowns.add({stringList:colorStrings, selectedIndex:0, minWidth: 259});
				}
			}
		}
	}
	var returned = dialog.show();
	
	if (returned){
		numRows = parseInt(numRowsBox.editContents);
		numColumns = parseInt(numColumnsBox.editContents);
		rowGutter = parseFloat(rowGutterBox.editContents);
		columnGutter = parseFloat(columnGutterBox.editContents);
		activeGuideColor = UIColors[colorMenu.stringList[colorMenu.selectedIndex]];
		drawGuidesAroundObject();
	}
}
