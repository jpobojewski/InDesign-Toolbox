//
// Detail Typesetting
// v 2.0
// by John Pobojewski, 2014
//
// Details text following the common rules of typesetting
//

app.doScript(main, ScriptLanguage.JAVASCRIPT, undefined, UndoModes.entireScript, "Detail Typesetting");

function main(){

	var CHECK_DOCUMENT = false;
	var CHECK_JUSTIFICATION = true;
	var CHECK_ENDASH = true;
	var CHECK_EMDASH = true;
	var CHECK_ELLIPSIS = true;
	var CHECK_TWOSPACES = true;
	var CHECK_MEASUREMENTS = true;
	var CHECK_MATH = true;	
	 
	getDialog();
}

function getDialog(){
	var Dialog;
	with(Dialog = app.dialogs.add({name:"Detail Typesetting"})){
		with(dialogColumns.add()){
			with(borderPanels.add()){
				staticTexts.add({staticLabel:"Check:"});
				var checkSettings = radiobuttonGroups.add();
				with(checkSettings){
					radiobuttonControls.add({staticLabel:"Selection", checkedState:true});
					radiobuttonControls.add({staticLabel:"Document"});
				}				
			}
			with(borderPanels.add()){
				with(dialogColumns.add()){					
					var checkJustification = checkboxControls.add({staticLabel:"Justification", checkedState:true});
					var checkEnDash        = checkboxControls.add({staticLabel:"En Dash", checkedState:true});
					var checkEmDash        = checkboxControls.add({staticLabel:"Em Dash", checkedState:true});
					var checkEllipsis      = checkboxControls.add({staticLabel:"Ellipsis", checkedState:true});
					var checkTwoSpaces     = checkboxControls.add({staticLabel:"Extra Space at End of Sentence", checkedState:true});
					var checkMeasurements  = checkboxControls.add({staticLabel:"Measurement Marks", checkedState:true});
					var checkMath          = checkboxControls.add({staticLabel:"Math Marks", checkedState:true});
				}
			}	
		}
	}
	myResult = Dialog.show();
	if (myResult == true){
		
		if (checkSettings.selectedButton == 0) CHECK_DOCUMENT = false; 
		if (checkSettings.selectedButton == 1) CHECK_DOCUMENT = true; 
		
		CHECK_JUSTIFICATION = checkJustification;  
		CHECK_ENDASH = checkEnDash;    
		CHECK_EMDASH = checkEmDash;    
		CHECK_ELLIPSIS = checkEllipsis;  
		CHECK_TWOSPACES = checkTwoSpaces; 
		CHECK_MEASUREMENTS = checkMeasurements;   
		CHECK_MATH = checkMath;    

		//Reset the find/change preferences before each search.
		app.changeTextPreferences = NothingEnum.nothing;
		app.findTextPreferences   = NothingEnum.nothing;

		if (CHECK_DOCUMENT){
			checkDocument();
		} else {
			checkSelection();
		}

		//Reset the find/change preferences before each search.
		app.changeTextPreferences = NothingEnum.nothing;
		app.findTextPreferences   = NothingEnum.nothing;

		//Remove the dialog from memory.
		Dialog.destroy();
	}
	else{
		//Remove the dialog from memory.
		Dialog.destroy();
	}
}

function checkDocument(){
	var _doc = app.activeDocument;

	for (var i=0; i<_doc.pages.length; i++){
		var _pg = _doc.pages[i];
		for (var j=0; j<_pg.textFrames.length; j++){
			_pg.textFrames[j].parentStory.contents = scrubTypographyInString(_pg.textFrames[j].parentStory.contents);
			for (var p=0; p<_pg.textFrames[j].parentStory.paragraphs.length; p++){
				scrubJustification(_pg.textFrames[j].parentStory.paragraphs.item(p));	
			}
		}
	}
}

function checkSelection(){
	for (var i=0; i<app.selection.length; i++){
		var s = app.selection[i];

		switch (s.constructor.name){
			case "Text":
				s.contents = scrubTypographyInString(s.contents);
				for (var p=0; p<s.paragraphs.length; p++){
					scrubJustification(s.paragraphs[p]);	
				}
				break;
			
			case "InsertionPoint":
				s.parentStory.contents = scrubTypographyInString(s.parentStory.contents);
				for (var p=0; p<s.parentStory.paragraphs.length; p++){
					scrubJustification(s.parentStory.paragraphs[p]);	
				}
				break;
			
			case "TextFrame":
				s.parentStory.contents = scrubTypographyInString(s.parentStory.contents);
				for (var p=0; p<s.parentStory.paragraphs.length; p++){
					scrubJustification(s.parentStory.paragraphs.item(p));	
				}
				break;
			
			default:
				//Selection is a not a text object.
				//There's still a chance it could be a textPath object
				for (var tp = 0; tp < s.textPaths.length; tp++){
					s.textPaths.item(tp).parentStory = checkTypographyInString( tps.parentStory );
					for (var p=0; p<s.textPaths.item(tp).parentStory.paragraphs.length; p++){
						scrubJustification(s.textPaths.item(tp).parentStory.paragraphs[p]);	
					}					
				}
				break;
		}
		newScrubPrimeMarks();
	}			
}

function scrubTypographyInString(str){

    //two spaces after a period, question mark, or exclaimation point
    str = str.replace(/([.!?])\s{2,}/g, "$1 ");

	if (CHECK_ENDASH){
		//en dash
		str = str.replace(/([0-9,]+)-([0-9,]+)/g, "$1\u2013$2"); 
		str = str.replace(/([0-9,]+) - ([0-9,]+)/g, "$1\u2013$2"); 
		str = str.replace(/([0-9,]+)--([0-9,]+)/g, "$1\u2013$2"); 	
		str = str.replace(/([0-9,]+) -- ([0-9,]+)/g, "$1\u2013$2"); 
		str = str.replace(/([0-9,]+)---([0-9,]+)/g, "$1\u2013$2"); 	
		str = str.replace(/([0-9,]+) --- ([0-9,]+)/g, "$1\u2013$2");		
	}

    //em dash
    str = str.replace(/(\w+) - (\w+)/g, "$1 \u2014 $2");
    str = str.replace(/(\w+)--(\w+)/g, "$1 \u2014 $2");
    str = str.replace(/(\w+) -- (\w+)/g, "$1 \u2014 $2");
    str = str.replace(/(\w+)---(\w+)/g, "$1 \u2014 $2");
	
    //ellipse
    str = str.replace(/\.\.\./g, "\u2026"); 
	
	//multiplication sign
    str = str.replace(/(\s)x(\s+)/g, "$1\u00D7$2"); 
    str = str.replace(/x([0-9,]+)/g, "\u00D7$1"); 	    
	
    return str;
}	

function newScrubPrimeMarks(){
	app.activeDocument.textPreferences.typographersQuotes = false;

	app.findGrepPreferences = NothingEnum.nothing;
	app.changeGrepPreferences = NothingEnum.nothing;	

	app.changeGrepPreferences.changeTo = "$1'";
	app.findGrepPreferences.findWhat = "(?<=d)[~\u201D~]]";
	app.selection[0].changeGrep( );

	app.findGrepPreferences = NothingEnum.nothing;
	app.changeGrepPreferences = NothingEnum.nothing;

	app.activeDocument.textPreferences.typographersQuotes = true;	
}

function scrubPrimeMarks(){
	//find out the current document's Typographers Quote Preference
	userOriginalQuotePreference = app.activeDocument.textPreferences.typographersQuotes

	//turn off the Typographers preference
	app.activeDocument.textPreferences.typographersQuotes = false
	
	//set Find/Change preferences to nothing, in case the user had left settings on a previous search
	app.findTextPreferences = NothingEnum.nothing
	app.changeTextPreferences = NothingEnum.nothing

	//====================== PERFORM SEARCHES  ======================
	//change left double quote into inch mark
	app.findTextPreferences.findWhat = "\u201C"
	app.changeTextPreferences.changeTo = "\u0022"
	app.selection[0].changeText( )

	//change right double quote into inch mark
	app.findTextPreferences.findWhat = "\u201D"
	app.changeTextPreferences.changeTo = "\u0022"
	app.selection[0].changeText( )
	
	//change left single quote into foot mark
	app.findTextPreferences.findWhat = "^9\u2018"
	app.changeTextPreferences.changeTo = "^9\u0027"
	app.selection[0].changeText( )
	
	//change right single quote into foot mark  
	app.findTextPreferences.findWhat = "^9\u2019"
	app.changeTextPreferences.changeTo = "^9\u0027"
	app.selection[0].changeText( )

	//reset Typographers Quote Preference back to the users original setting
	app.activeDocument.textPreferences.typographersQuotes = userOriginalQuotePreference	

}

function scrubJustification( paragraph ){
	if (CHECK_JUSTIFICATION){
		paragraph.minimumGlyphScaling = 100;
		paragraph.desiredGlyphScaling = 100;
		paragraph.maximumGlyphScaling = 100;

		paragraph.minimumLetterSpacing = 0;
		paragraph.desiredLetterSpacing = 0;
		paragraph.maximumLetterSpacing = 0;

		paragraph.minimumWordSpacing = 80;
		paragraph.desiredWordSpacing = 80;
		paragraph.maximumWordSpacing = 80;
	}
}
	