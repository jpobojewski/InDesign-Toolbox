// Shuffle Page Order
// v 2.0
//
// a quick script to randomly shuffle a document's pages
// Bud Rodecker ©2009 / Revised J Pobojewski ©2014
//

var _doc 	   = app.activeDocument;
var _pages 	   = _doc.pages;
var _pageArray = [];

app.doScript (main, ScriptLanguage.JAVASCRIPT, undefined, UndoModes.entireScript, "Shuffle Page Order");

function main(){
	setPageArray();

	for (var i=0; i< _pages.length; i++){
		_pages[i].move(
			LocationOptions.AFTER,
			_pages[_pageArray[i]]
		);
	}
	alert(_pages.length + " pages shuffled!");
};

function setPageArray(){
	var a = [];
	for (var i=0; i< _pages.length; i++){
		a.push(i);
	}
	_pageArray = randomizeUsingFisherYates(a);
}

function randomizeUsingFisherYates(myArray) {
	var i = myArray.length;
	if (i == 0) return false;
	while (--i) {
		var j = Math.floor( Math.random() * (i+1));
		var tempi = myArray[i];
		var tempj = myArray[j];
		myArray[i] = tempj;
		myArray[j] = tempi;
	}
	return myArray;
}