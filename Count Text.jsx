//Count Text
//Based on TextCounter.js: An InDesign 3 JavaScript
//
//Counts text objects in the selection, in the selected story, or in all stories in a document.
//

app.doScript (main, ScriptLanguage.JAVASCRIPT, undefined, UndoModes.entireScript, "Count Text");

function main(){
	if(app.documents.length != 0){
		if(app.activeDocument.stories.length > 0){
			myDisplayDialog();
		}
		else{
			alert("The current document does not contain any text.");
		}
	}
	else{
		alert("No documents are open. Please open a document and try again.");
	}
}

function myDisplayDialog(){
	var myCountButtons, myRangeButtons;
	var myDialog = app.dialogs.add({name:"Count Text"});
	with(myDialog.dialogColumns.add()){	
		with(borderPanels.add()){
			staticTexts.add({staticLabel:"Count:"});
			with(myCountButtons = radiobuttonGroups.add()){
				radiobuttonControls.add({staticLabel:"Characters"});
				radiobuttonControls.add({staticLabel:"Words", checkedState:true});
				radiobuttonControls.add({staticLabel:"Lines"});
				radiobuttonControls.add({staticLabel:"Paragraphs"});
			}
		}
		with(borderPanels.add()){
			staticTexts.add({staticLabel:"Range:"});
			with(myRangeButtons = radiobuttonGroups.add()){
				radiobuttonControls.add({staticLabel:"Selection", checkedState:true});
				radiobuttonControls.add({staticLabel:"Selected Story"});
				radiobuttonControls.add({staticLabel:"All Stories"});
			}
		}
	}
	var myReturn = myDialog.show();
	if (myReturn == true){
		//Get the values from the dialog box.
		var myRangeType = myRangeButtons.selectedButton;
		var myCountType = myCountButtons.selectedButton;
		myDialog.destroy();
		myTextCounter(myRangeType, myCountType);
	}
	else{
		myDialog.destroy();
	}
}
function myTextCounter(myRangeType, myCountType){
	var myDocument, myTextCount, mySelection, myCountingUnit;
	with (myDocument = app.activeDocument){
		//Set the AlreadyCounted key of any stories in the document to false.
		for (var myStoryCounter = 0; myStoryCounter < myDocument.stories.length; myStoryCounter ++){
			myDocument.stories.item(myStoryCounter).insertLabel("AlreadyCounted", "False")
		}
		switch (myRangeType){
			case 0:
				//Count the text in the selection.
				//If multiple text frames are selected, all of the
				//text in the frames will be counted.
				mySelection = selection;
				if (mySelection.length == 1){
					myTextCount = mySelectionSorter(mySelection[0], myRangeType, myCountType);	
				}
				else{
					myTextCount = 0;
					for (var myCounter = 0; myCounter < mySelection.length; myCounter++){
						myTextCount = myTextCount + mySelectionSorter(mySelection[myCounter], myRangeType, myCountType);
					}
				}
				break;
			case 1:
				//Count the text in the parent story (or stories) of the selection)
				mySelection = selection;
				if (mySelection.length == 1){
					myTextCount = mySelectionSorter(mySelection[0], myRangeType, myCountType);
				}
				else{
					myTextCount = 0;
					//Now iterate through the items and count the text.
					for (var myCounter = 0; myCounter < mySelection.length; myCounter++){
						myTextCount = myTextCount + mySelectionSorter(mySelection[myCounter], myRangeType, myCountType);
					}
				}
				break;
			case 2:
				//Count the text in all stories of the active document.
				myTextCount = 0;
				for(var myStoryCounter = 0; myStoryCounter < myDocument.stories.length; myStoryCounter ++){
					myTextCount = myTextCount + myCountText(myDocument.stories.item(myStoryCounter), myCountType);
				}
				break;
		}
		switch(myCountType){
			case 0:
				if (myTextCount == 1){
					myCountingUnit = "character";
				}
				else {
					myCountingUnit = "characters";
				}
				break;
			case 1:
				if (myTextCount == 1){
					myCountingUnit = "word";
				}
				else {
					myCountingUnit = "words";
				}
				break;
			case 2:
				if (myTextCount == 1){
					myCountingUnit = "line";
				}
				else {
					myCountingUnit = "lines";
				}
				break;
			case 3:
				if (myTextCount == 1){
					myCountingUnit = "paragraph";
				}
				else {
					myCountingUnit = "paragraphs";
				}
				break;
		}
		var myDialog = app.dialogs.add({name:"Count Text", canCancel:false});
		with(myDialog){
			//Add a dialog column.
			with(dialogColumns.add()){
				with(borderPanels.add()){
					staticTexts.add({staticLabel:"InDesign found "});
					with(dialogColumns.add()){
						textEditboxes.add({editContents:myTextCount+""});
					}
					with(dialogColumns.add()){
						staticTexts.add({staticLabel:myCountingUnit});
					}
				}
			}
		}
		myDialog.show();
		myDialog.destroy();
	}
}
function mySelectionSorter(myObject, myRangeType, myCountType){
	var myTextCount;
	switch (myObject.constructor.name){
		case "Text":
		case "InsertionPoint":
			switch (myRangeType){
				case 0:
					myTextCount = myCountText(myObject, myCountType);
					break;
				case 1:
					myTextCount = myCountText(myObject.parentStory, myCountType);
					break;
			}
			break;
		case "TextFrame":
			switch (myRangeType){
				case 0:
					myTextCount = myCountText(myObject.texts.item(0), myCountType);
					break;
				case 1:
					//Has the parent story already been counted?
					myStory = myObject.parentStory;
					myCountedState = myStory.extractLabel("AlreadyCounted");
					if (myCountedState != "True"){
						myTextCount = myCountText(myStory, myCountType);
						myStory.insertLabel("AlreadyCounted", "True");
					}
					else {
						myTextCount = 0;
					}
					break;
			}
			break;
		default:
			//Selection is a not a text object.
			//There's still a chance it could be a textPath object.
			if (myObject.textPaths.length !=0){
				myTextCount = 0;
				if (myRangeType == 1){
					for (myTextPathCounter = 0; myTextPathCounter < myObject.textPaths.length; myTextPathCounter ++){
						myStory = myObject.textPaths.item(myTextPathCounter).parentStory;
						myCountedState = myStory.extractLabel("AlreadyCounted");
						if (myCountedState != "True"){
							myTextCount = myTextCount + myCountText(myObject.textPaths.item(myTextPathCounter).parentStory, myCountType);
							myObject.textPaths.item(myTextPathCounter).parentStory.insertLabel("AlreadyCounted","True");
						}
						else{
							myTextCount = 0;
						}
					}
				}
				else {
					for (myTextPathCounter = 0; myTextPathCounter < myObject.textPaths.length; myTextPathCounter ++){
						myTextCount = myTextCount + myCountText(myObject.textPaths.item(myTextPathCounter).texts.item(0), myCountType);
					}
				}
			}
			else {
				myTextCount = 0;
			}
			break;			
	}
	return myTextCount;
}
function myCountText(myTextObject, myCountType){
	var myTextCount;
	switch(myCountType){
		case 0:
			//count characters
			myTextCount = myTextObject.characters.length;
			break;
		case 1:
			//count words
			myTextCount = myTextObject.words.length;
			break;
		case 2:
			//count lines
			myTextCount = myTextObject.lines.length;
			break;
		case 3:
			//count paragraphs
			myTextCount = myTextObject.paragraphs.length;
			break;
	}
	return myTextCount;
}