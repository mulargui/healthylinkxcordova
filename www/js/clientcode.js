//var API_URL_PREFIX = "http://127.0.0.1:8081/";
var API_URL_PREFIX = "http://192.168.1.228:8081/"; //android phones doesn't like localhost
var methodseparator="?"

//var API_URL_PREFIX = "http://127.0.0.1:8080/api.php?rquest=";
//var API_URL_PREFIX = "http://127.0.0.1:8081/api.php?rquest=";
//var methodseparator="&"

var paramseparator="&"

function showSearchResults() {
	var requeststring = API_URL_PREFIX+"providers";
	var firstparam = true;

	var buffer= $('#zipCode').val();
	if (buffer){
		if(firstparam){
			requeststring+=methodseparator;
			firstparam=false;
		}else{
			requeststring+=paramseparator;
		}
		requeststring+="zipcode=";
		requeststring+=buffer;
	}
	
	buffer="";
	var buffer= $('#gender').val();
	if ((buffer[0]=='M')||(buffer[0]=='F')){
		if(firstparam){
			requeststring+=methodseparator;
			firstparam=false;
		}else{
			requeststring+=paramseparator;
		}
		requeststring+="gender=";
		requeststring+=buffer[0];
	}

	buffer="";
	var buffer= $('#lastname').val();
	if (buffer){
		if(firstparam){
			requeststring+=methodseparator;
			firstparam=false;
		}else{
			requeststring+=paramseparator;
		}
		requeststring+="lastname1=";
		requeststring+=buffer;
	}

	buffer="";
	var buffer= $('#specialty').val();
	if (buffer){
		if(firstparam){
			requeststring+=methodseparator;
			firstparam=false;
		}else{
			requeststring+=paramseparator;
		}
		requeststring+="specialty=";
		requeststring+=buffer;
	}

	buffer="";
	var buffer= $('#distance').val();
	if (buffer){
		if(firstparam){
			requeststring+=methodseparator;
			firstparam=false;
		}else{
			requeststring+=paramseparator;
		}
		requeststring+="distance=";
		requeststring+=buffer;
	}

	$('#resultsTable tbody').empty();
	$.getJSON(requeststring,function(data){
		if (data!=null) {
			$.each(data, function(i, item) {
				var row = "<TR>";
				$.each(item, function(j, field) {
					if (j=="NPI") {
						row += "<TD><input type=\"checkbox\" id=\"" + field + "\"></TD>";
					}else {
						row +='<TD>'+field+'</TD>'; 
					}
				});
				row+='</TR>';
				$('#resultsTable tbody').append(row);
			});
		} else {
			showMessage('No matching providers were found.');
		}
	});
}

function showShortProviderList(){
	var selectedNPIs = new Array();
	$('#resultsTable input:checked').each(function() {
	    selectedNPIs.push($(this).attr('id'));
    });

	if (selectedNPIs.length==0) {
		showMessage('No providers were selected.');
		return;
	}

	var len= selectedNPIs.length;
	if (len >3) {
		showMessage('Too many providers were selected, maximum is three.');
		return;
	}

	var requeststring = API_URL_PREFIX+"shortlist";
	var firstparam = true;

	for(var i=0; i < len; i++) {
		if(firstparam){
			requeststring+=methodseparator;
			firstparam=false;
		}else{
			requeststring+=paramseparator;
		}
		requeststring+="NPI";
		requeststring+=i+1;
		requeststring+="=";
		requeststring+=selectedNPIs[i];
	}

	$('#shortresultsTable tbody').empty();
	$.getJSON(requeststring,function(data){
		if (data!=null) {
			$.each(data, function(i, item) {
				if ("Transaction" in item){
					$('#shortresultsTable tbody').append('<TR>'+'<TD>'+'<strong>'+"Transaction number: "+'</strong>'+item.Transaction+'</TD>'+'</TR>');
				}else{
					$.each(item, function(j, provider) {
						var row = "<TR>";
						$.each(provider, function(k, field) {
							row +='<TD>'+field+'</TD>'; 
						});
						row+='</TR>';
						$('#shortresultsTable tbody').append(row);
					});
				}
			});
		} else {
			showMessage('No matching providers were found.');
		}
	});
}

function loadTaxonomyCodes() {
	var taxonomyTags = new Array();
	$.getJSON(API_URL_PREFIX+"taxonomy")
	.done(function(data){
		$.each(data, function(i, code){
			taxonomyTags.push(code.Classification);
		});
		$("#specialty").autocomplete({source: taxonomyTags});
	})
	.fail(function(jqxhr, textStatus, error ) {
		var err = textStatus + ", " + error;
		showMessage(err);
	});
}

function getGeoLocation() {
	navigator.geolocation.getCurrentPosition(
		function (position) {
			showMessage('Latitude: ' + position.coords.latitude + '\n' +
				'Longitude: ' + position.coords.longitude + '\n' +
				'Altitude: ' + position.coords.altitude + '\n' +
				'Accuracy: ' + position.coords.accuracy + '\n' );
		},		
		function (error) {
			showMessage('GeoLocation error. \nCode: ' + error.code + '\nMessage: ' + error.message);
		}, 
		{maximumAge: Infinity, timeout: 10000, enableHighAccuracy: true}
	);
}

function showMessage(text) {
	$('#messageText').text(text);
	$('#MessageArea').show();
}

function newSearch() {
	$('#MessageArea').hide();
	$('#ProvidersList').hide();
	$('#ProvidersShortList').hide();
	$('#ProvidersSearch').show();
}

function shortProviderList() {
	$('#MessageArea').hide();
	showShortProviderList();
	$('#ProvidersSearch').hide();
	$('#ProvidersList').hide();
	$('#ProvidersShortList').show();
}

function searchProviders() {
	$('#MessageArea').hide();
	showSearchResults();
	$('#ProvidersSearch').hide();
	$('#ProvidersShortList').hide();
	$('#ProvidersList').show();
}

/*
$(document).ready(function() {
	loadTaxonomyCodes(); 	
});
*/