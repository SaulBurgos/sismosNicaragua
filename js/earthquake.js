var map;
var infoWindow;
var iframeTimer; 
var faults = undefined;

var boundsFaults = new google.maps.LatLngBounds(
   	new google.maps.LatLng(12.041882,-86.36916),
   	new google.maps.LatLng(12.168166,-86.139477)
	);

var urlIneter = 'http://webserver2.ineter.gob.ni/geofisica/sis/events/sismos.php';
var imageFaults = 'img/fallas.png';

//google configuration, to obtain the color circle
var low = [151, 83, 34];   // color of mag 1.0
var high = [5, 69, 54];  // color of mag 6.0 and above
var minMag = 1.0;
var maxMag = 6.0;


var customData = [
		{
			latLng : new google.maps.LatLng(12.37,-86.45),
			time : '14/04/10 18:01:22',
			mag: 5.0,place : 'Cerca del volcan Momotombo',
			title : 'Sismo Cerca del volcan Momotombo',
			prof : 0.6
		},
		{
			latLng : new google.maps.LatLng(12.09,-86.27),
			time : '14/04/10 21:20:50',
			mag: 3.4,place : 'Cerca de Managua',
			title : 'Sismo cerca de Managua',
			prof : 0.0
		},
		{
			latLng : new google.maps.LatLng(12.17,-86.27),
			time : '14/04/11 11:54:37',
			mag: 3.8,place : 'Sur del Lago de Managua',
			title : 'Sismo en Sur del lago de Managua',
			prof : 19.6
		},
		{
			latLng : new google.maps.LatLng(12.36,-86.46),
			time : '14/04/11 12:17:18',
			mag: 4.4,place : 'Cerca del volcan Momotombo',
			title : 'Sismo Cerca del volcan Momotombo',
			prof : 2.8
		},
		{
			latLng : new google.maps.LatLng(12.18,-86.27),
			time : '14/04/12 16:38:07',
			mag: 2.2,place : 'Sur del lago de Managua',
			title : 'Sismo en Sur del lago de Managua',
			prof : 8
		},
		{
			latLng : new google.maps.LatLng(12.25,-86.35),
			time : '14/04/12 19:20:05',
			mag: 4.3,place : 'Cerca del volcan Apoyeque',
			title : 'Sismo Cerca del volcan Apoyeque',
			prof : 5.1
		},
		{
			latLng : new google.maps.LatLng(12.26,-86.34),
			time : '14/04/13 22:12:24',
			mag: 4.4,place : 'Cerca del volcan Apoyeque',
			title : 'Sismo Cerca del volcan Apoyeque',
			prof :  5.6
		},
		{
			latLng : new google.maps.LatLng(12.23,-86.34),
			time : '14/04/13 23:07:03',
			mag: 5.6,place : 'Cerca del volcan Apoyeque',
			title : 'Sismo Cerca del volcan Apoyeque',
			prof :  5.4
		},
		{
			latLng : new google.maps.LatLng(12.21,-86.35),
			time : '14/04/14 00:12:31',
			mag: 4.0,place : 'Cerca del volcan Apoyeque',
			title : 'Sismo Cerca del volcan Apoyeque',
			prof :  6.5
		},
		{
			latLng : new google.maps.LatLng(12.20,-86.31),
			time : '14/04/15 01:04:04',
			mag: 3.5,place : 'En o cerca de Managua',
			title : 'Sismo En o cerca de Managua',
			prof :  6.1
		},
		{
			latLng : new google.maps.LatLng(12.42,-86.49),
			time : '14/04/14 01:16:03',
			mag: 4.2,place : 'Cerca del volcan Momotombo',
			title : 'Sismo En o cerca de Managua',
			prof :  2.0
		},
		{
			latLng : new google.maps.LatLng(12.19,-86.32),
			time : '14/04/14 22:28:07',
			mag: 4.2,place : 'En o cerca de Managua',
			title : 'Sismo En o cerca de Managua',
			prof :  5.8
		}

	];

$( document ).ready(function() {

	toastr.options.closeButton = true;
	toastr.options.timeOut = 10000;

	$('#closeMsg').on('click',function(){
		$('#msgFloat').fadeOut( "slow" );
	});

 	var mapOptions = {
		center: new google.maps.LatLng(13.00, -84.84),
		zoom: 8,
		mapTypeId: google.maps.MapTypeId.TERRAIN, 
		draggable : true
	};
   map = new google.maps.Map(document.getElementById("map"),  mapOptions);
   infoWindow = new google.maps.InfoWindow();


   google.maps.event.addListenerOnce(map, 'idle', function(){
		loadGeojson();		
	});

  

   $('#showFault').on('click',function() {

   	 toastr.warning('La imagen puede tardar unos segundos en aparecer por favor espera...');

   	if(typeof faults === 'undefined') {
   		faults = new USGSOverlay(boundsFaults,imageFaults, map);
   	} else {
   		faults.toggle();
   	}

   	map.fitBounds(boundsFaults);

   });

   $('#showDataIneter').on('click',function() {

   	if($('#msgFloat').is(':visible')){
   		$('#msgFloat').fadeOut("fast");
   		$('#inforIneter').attr('src','');
   	} else {
   		toastr.warning('Los datos Ineter pueden no cargar, debido a la sobrecarga del servidor Ineter.')
   		$('#loadingIneter').show();
   		$('#loadingIneter').html('Cargando datos Ineter...<img src="img/29.gif" height="30" width="30">');
   		$('#msgFloat').fadeIn("fast");
   		$('#inforIneter').attr('src',urlIneter);
   		 iframeTimer = setTimeout("errorIframe()", 40000);
		   $('#inforIneter').load(function() {
		   		$('#loadingIneter').hide();
		   		$(this).fadeIn("fast");
		   		clearTimeout(iframeTimer);
		   }).error(function(){
		   		$('#loadingIneter').html('Error cargando datos Ineter...');
		   });
   	}

   	

   });

});



function errorIframe() {
	$('#inforIneter').hide();
	$('#loadingIneter').html('Servidor Ineter no responde, por favor recarga de nuevo.!!');
}

function loadGeojson () {
	$('#loadingAjax').show();
	// This feed is a copy from the USGS feed, you can find the originals here:
  //   http://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php
  var script = document.createElement('script');
  script.setAttribute('src',
      'http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojsonp');
  document.getElementsByTagName('head')[0].appendChild(script);
}

/*function createMarker(data) {

	for (var i = 0; i < data.features.length; i++) {


		var myLatlng = new google.maps.LatLng(
			data.features[i].geometry.coordinates[1],
			data.features[i].geometry.coordinates[0]
		);

		var marker = new google.maps.Marker({
			position: myLatlng,
			map: map,
			icon: 'img/earthquake-3.png'
		});

	};
}*/

function centerMapOnPoints(data) {
	var recent = data.features[0];
	var bounds = new google.maps.LatLngBounds();

	for (var i = 0; i < data.features.length; i++) {

		bounds.extend(data.features[i].latLngObj);

		if(recent.properties.time <= data.features[i].properties.time ) {
			recent = data.features[i];
		}
		
	};
	
	map.fitBounds(bounds);
	
}

/*function updateRecentInfo(recent) {

	var updated = new Date(recent.properties.updated);
	var link = '<a href="' + recent.properties.url + '" target="_blank">Ver</a>';
	
	var info = '<div><b>Magnitud: </b>' + recent.properties.mag + '<br>' + 
	'<b>Lugar: </b>' + recent.properties.place + '<br>' + 
	'<b>Nombre: </b>' + recent.properties.title +  '<br>' + 
	'<b>Updated: </b>' + updated +  '<br>' + 
	'<b>Link: </b>' + link +  '<br>' +
	'</div>' ;

	$('#feedLast').html(info);
}*/

function filterFeature(data) {

	var bounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(10.35,-88.87),
      new google.maps.LatLng(15.36,-82.01)
   );

	/*var temp = new google.maps.Rectangle({
		strokeColor: '#FF0000',
		strokeOpacity: 0.8,
		strokeWeight: 2,
		fillColor: '#FF0000',
		fillOpacity: 0.35,
		map: map,
		bounds: bounds
	});*/

	var filtered = [];

	for (var i = 0; i < data.features.length; i++) {

		var myLatlng = new google.maps.LatLng(
			data.features[i].geometry.coordinates[1],
			data.features[i].geometry.coordinates[0]
		);

		if (bounds.contains(myLatlng)) {
			data.features[i].latLngObj = myLatlng;
			filtered.push(data.features[i]);
		}

	};

	data.features = filtered;
	return data;
}

function eqfeed_callback(data) {
	var filtered =  filterFeature(data);
	map.data.addGeoJson(filtered);
	map.data.setStyle(styleFeature);
	$('#loadingAjax').hide();
   centerMapOnPoints(filtered);

   addCustomData();

   map.data.addListener('click', function(event) {
   	showInfo(event.feature);
  	});

}

function getIconScale(scale, color) {

	//global funcion google
	var fraction = (Math.min(scale, maxMag) - minMag) / (maxMag - minMag);
	var color = interpolateHsl(low, high, fraction);

  return {
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: color,
    fillOpacity: .6,
    strokeColor: 'white',
    strokeWeight: .5,
    scale: Math.pow(scale, 2)
  };
}

function addCustomData() {

	for (var i = 0; i < customData.length; i++) {

		var marker = new google.maps.Marker({
			position:customData[i].latLng,
			map: map,
			icon : getIconScale(customData[i].mag, 'red')
		}); 
		showInfoMarker(marker,i);	
	};
	
}

function showInfoMarker(marker,index) {

	google.maps.event.addListener(marker, 'click', function(){
		
		var data =  customData[index];

		var info = '<div id="infoWindow"><b>Magnitud: </b>' + data.mag + '<br>' + 
		'<b>Profundidad: </b>' + data.prof + ' KM<br>' + 
		'<b>Lugar: </b>' + data.place + '<br>' + 
		'<b>Nombre: </b>' + data.title +  '<br>' + 
		'<b>fecha: </b>' + data.time +  '<br>' + 
		'<b>Info por: </b><a href="http://www.ineter.gob.ni/articulos/areas-tecnicas/geofisica/monitoreo-de-sismos-en-tiempo-real.html" target="_blank">Ineter</a><br>' + 
		'</div>' ; 

		infoWindow.setContent(info);
		infoWindow.setPosition(marker.getPosition());
		infoWindow.open(map);

	});
	
	
}



function showInfo(data) {

	var updated = new Date(data.getProperty('time'));
	var link = '<a href="' + data.getProperty('url') + '" target="_blank">Ver</a>';

	var info = '<div id="infoWindow"><b>Magnitud: </b>' + data.getProperty('mag') + '<br>' + 
	'<b>Lugar: </b>' + data.getProperty('place') + '<br>' + 
	'<b>Nombre: </b>' + data.getProperty('title') +  '<br>' + 
	'<b>fecha: </b>' + updated +  '<br>' + 
	'<b>Link: </b>' + link +  '<br>' + 
	'<b>Revisado: </b>' + data.getProperty('status') +  '<br>' + 
	'<b>Significativo (0 a 1000): </b>' + data.getProperty('sig') +  '<br>' + 
	'<b>Info por: </b><a href="http://earthquake.usgs.gov/" target="_blank">U.S. Geological Survey</a><br>' + 
	'</div>' ;

	infoWindow.setContent(info);
	infoWindow.setPosition(data.getGeometry().get());
	infoWindow.open(map);
	
}

function styleFeature(feature) {

  // fraction represents where the value sits between the min and max
  var fraction = (Math.min(feature.getProperty('mag'), maxMag) - minMag) / (maxMag - minMag);

  var color = interpolateHsl(low, high, fraction);

  return {
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      strokeWeight: 0.5,
      strokeColor: '#fff',
      fillColor: color,
      fillOpacity: 4 / feature.getProperty('mag'),
      // while an exponent would technically be correct, quadratic looks nicer
      scale: Math.pow(feature.getProperty('mag'), 2)
    },
    zIndex: Math.floor(feature.getProperty('mag'))
  };
}

function interpolateHsl(lowHsl, highHsl, fraction) {
  var color = [];
  for (var i = 0; i < 3; i++) {
    // Calculate color based on the fraction.
    color[i] = (highHsl[i] - lowHsl[i]) * fraction + lowHsl[i];
  }

  return 'hsl(' + color[0] + ',' + color[1] + '%,' + color[2] + '%)';
}