//
// Export List of Graphics
// v 1.0
// by John Pobojewski, 2006
//
// Exports graphics list as a CSV
//

app.doScript (main, ScriptLanguage.JAVASCRIPT, undefined, UndoModes.entireScript, "Export List of Graphics");

function main(){
	var _doc = app.activeDocument;
	var _graphics = _doc.allGraphics;
	var graphicstore = [];
	var temp = "";
	var eps = 0;
	var jpg = 0;
	var tif = 0;
	var psd = 0;
	var ai = 0;
	var null_cnt = 0;

	temp += "Name,Width,Height,Overscaled?,Page Number,X Pos,Y Pos,DPI\n\n";

	for (var aa = 0; aa < _graphics.length; aa++){
		var currLink = "";
		var isNull = false;
		
		try {
			currLink = _graphics[aa].itemLink.name;			
		} catch(e){
			currLink = "----Embedded----";
			isNull = true;
		}

		var currStatus = "";
		var currHScale = _graphics[aa].absoluteHorizontalScale;
		var currVScale = _graphics[aa].absoluteVerticalScale;
		
		if (!isNull){
			var splitName = currLink.split(".");
			switch (splitName[splitName.length-1]){
				case "eps":
					eps++;
					break;
				case "jpg":	
					jpg++;
					break;
				case "tif":	
					tif++;
					break;
				case "psd":
					psd++;
					break;
				case "ai":	
					ai++;
					break;
			}			
		} else {
			null_cnt++;
		}
		
	    temp += currLink + "," + Math.round( currHScale ) + "%" + "," + Math.round( currVScale ) + "%"; // + currStatus;


		if ( currHScale > 100 || currVScale > 100){
				temp += ",*,";
		} else {
				temp += ",,";
		}
		
		var x_dim = Math.round(_graphics[aa].parent.geometricBounds[3]*100)/100;
		var y_dim = Math.round(_graphics[aa].parent.geometricBounds[0]*100)/100;	
		
		if ( currHScale > 100 || currVScale > 100 || isNull){
			temp += _graphics[aa].parentPage.name + "," + x_dim + " ," + y_dim;
		} else {
			temp += _graphics[aa].parentPage.name + "," + x_dim + " ," + y_dim;	
		}

		temp += "," + _graphics[aa].effectivePpi + ",";
		temp += "\n";
	}

	temp += "\n";
	if (null_cnt > 0){
		temp += "EMBEDDED: " + null_cnt + "\n";
	}
	temp += "TOTAL: " + _graphics.length;

	myFolder = Folder.selectDialog ("Export Images List");

	fn = app.activeDocument.name.split('.')[0] + "_links.csv";
	fp = myFolder + "/" + fn;

	var graphicsFile = new File(fp);
	graphicsFile.open("w");
	graphicsFile.write(temp);
	graphicsFile.close();

	alert("Complete!");
}
