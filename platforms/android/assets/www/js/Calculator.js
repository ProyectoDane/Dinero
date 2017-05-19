'use strict';

function Calculator() {
	this.NUMBER = "number";
	this.OPERATOR = "operator";

	this.resetCalc();

	this.initializeHistory();

	this.reloadHistory(null,null);

	$('.btn-calculator').click({ context:this }, function(evt){
		evt.preventDefault();
		evt.data.context.addValueToCalculate(this)
	});

	$(".btn-clean-maths-historial").click({context:this}, this.cleanMathsHistorial);
}

Calculator.prototype.constructor = Calculator;

Calculator.prototype.addValueToCalculate = function(element) {
	var buttonPress = {};
	buttonPress.value = $(element).data('value').toString();
	buttonPress.type = $(element).data('type');

	if(buttonPress.value == "=") {
		this.calculate();
		return;
	}

	if(buttonPress.value == "reset") {
		this.resetCalc();
		return;
	}

	if($(".display").val() == "0" && isNaN(this.toCalculate[0].value) == false) {
		this.toCalculate = [];
	}

	this.toCalculate.push(buttonPress);
	this.updateDisplay();
}

Calculator.prototype.updateDisplay = function() {
	$(".display").val("");
	var tmpValue = "";

	for(var i=0; i<this.toCalculate.length; i++) {
		if(i > 0) {
			if(isNaN(this.toCalculate[i].value) == true && isNaN(this.toCalculate[i-1].value) == true) {
			 	this.toCalculate.splice(i-1,1);
			}
		}
	}

	for(var j=0; j<this.toCalculate.length; j++) {
		tmpValue += this.toCalculate[j].value;
	}

	$(".display").val(tmpValue);
}

Calculator.prototype.resetCalc = function() {
	this.toCalculate = [];
	this.toCalculate.push( {value:0,type:this.NUMBER} );
	this.updateDisplay();
}

Calculator.prototype.calculate = function() {
	var doTheMath = $(".display").val();
	var result = eval(doTheMath).toFixed(2);
	$(".display").val(result);
	this.toCalculate = [];
	this.toCalculate.push({ value:$(".display").val(), type: this.NUMBER });
	this.reloadHistory(doTheMath, result);
}

Calculator.prototype.initializeHistory = function () {
	var savedHistory = localStorage.getItem("maths");
	if (!savedHistory) {
		localStorage.setItem("maths", "[]");
	}
}

Calculator.prototype.reloadHistory = function(math,result) {
	if(math != undefined && math != null && result != undefined && result != null) {
		var obj = { math:math, result:result };
		this.addValueToStorage(obj);
	}

	$(".wrapper-history-list").html("");
	var item = null;
	var tmpMaths = JSON.parse(localStorage.getItem("maths"));
	for(var i=0; i<tmpMaths.length; i++) {
		item = '<li class="history-item-list" data-value="'+tmpMaths[i].result+'">'+ tmpMaths[i].math + ' = ' + tmpMaths[i].result +'</li>'
		$(".wrapper-history-list").append(item);
	}
	$(".history-item-list").click({ context:this }, this.onClickItemHistory );
}

Calculator.prototype.onClickItemHistory = function(evt) {
	evt.data.context.toCalculate = new Array();
	evt.data.context.toCalculate.push( {value:$(this).data("value"),type:evt.data.context.NUMBER} );
	$(".display").val($(this).data("value"));
	evt.data.context.updateDisplay();
}

Calculator.prototype.addValueToStorage = function(value) {
	if(localStorage) {
		var tmp = new Array();
		for(var i=0; i<JSON.parse(localStorage.getItem("maths")).length; i++) {
			tmp.push(JSON.parse(localStorage.getItem("maths"))[i]);
		}
		tmp.push(value);
		console.log(tmp);
		localStorage.setItem("maths",JSON.stringify(tmp));
	}
}

Calculator.prototype.cleanMathsHistorial = function(evt) {
	if(localStorage) {
		localStorage.setItem("maths","[]");
		evt.data.context.resetCalc();
		evt.data.context.reloadHistory();
	}
}

Calculator.prototype.toString = function() {
	return "Calculator";
}
