//google maps initialise
var map;

    function initialize() {
      var mapOptions = {
        zoom: 12,
        center: new google.maps.LatLng(12.9154502, 77.4981244),
        disableDefaultUI: true
      };
      map = new google.maps.Map(document.getElementById('gmap'),
        mapOptions);
    }
    initialize();

// Location Class completely builds everything needed for each location marker.
var Loc = function(name, long, lat, venueId) {
	var self = this;
	this.name = name;
	this.long = long;
	this.lat = lat;
	this.venueId = venueId;

// getConetent function retrieves 5 most recent tips from foursquare for the marker location.
	this.getContent = function() {
		var topcomm = [];
		var venueUrl = 'https://api.foursquare.com/v2/venues/' + self.venueId + '/tips?sort=recent&limit=5&v=20150609&client_id=W252SAVOZDZU3QTQ1CMDZOR0GCWRHCBKQHMDW1ZRIN2BAVRR&client_secret=EJMWHPN3ZHXQWENMP2UHSFYB1WI0F2RDEQMN304GMKGBIEUT';

		$.getJSON(venueUrl,
			function(data) {
				$.each(data.response.tips.items, function(i, tips){
					topcomm.push('<li>' + tips.text + '</li>');
				});

			}).done(function(){
			self.content ='<b style="text-align:center">' + self.name + '</b>' + '<h3>5 top Comments</h3>' + '<ol class="tips">' + topcomm.join('') + '</ol>';
			}).error(function(){
          self.content='<p>could not load the item</p>';
          })
		}();

		this.infowindow = new google.maps.InfoWindow();

		// Assigns a marker
			this.icon = 'http://www.googlemapsmarkers.com/v1/C/009900/';
			this.marker = new google.maps.Marker({
			position: new google.maps.LatLng(self.long, self.lat),
			map: map,
			name: self.name,
			icon: self.icon
		});

		// Opens the info window for the location marker.
		this.openInfowindow = function() {
			for (var i=0; i < locationsModel.locations.length; i++) {
   			locationsModel.locations[i].infowindow.close();
  		}
			map.panTo(self.marker.getPosition())
			self.infowindow.setContent(self.content);
			self.infowindow.open(map,self.marker);
		};

		// Assigns a click event listener to the marker to open the info window.
		this.addListener = google.maps.event.addListener(self.marker,'click', (this.openInfowindow));
	};

	// Contains all the locations and search function.
	var locationsModel = {

		locations:[
		new Location('By 2 coffee', 12.9648003,77.5389259 ,'51d8034a498e44075a4a92fc'),
		new Location('Captain\'s Food Court', 12.9190615,77.5183429, '52b4215211d2e0e5ef99e09b'),
		new Location('Cafe Coffee Day', 12.9190613,77.5117768, '4c61410f924b76b0ae8afab9'),
		new Location('Gopalan Arcade', 12.93597,77.5155649, '4beade509fa3ef3ba52f80c9'),
		new Location('Kaapi Katte', 12.9164329,77.5184768, '4f140fece4b0253d4f512942'),
		new Location('Chung Wah', 12.9250658,77.5486708, '4bd2c60cb221c9b62145d8d0'),
		new Location('Royal Andhra Spice', 12.9057565,77.5188221, '4de4d44ec65b7a3e21522847'),
		new Location('Pizza Hut',12.9057559,77.5035012, '4e7a0e46aeb79f7dabc48535')
		],
		query: ko.observable(''),
	};


	// Search function for filtering through the list of locations based on the name of the location.
	locationsModel.search = ko.dependentObservable(function() {
		var self = this;
		var search = this.query().toLowerCase();
		return ko.utils.arrayFilter(self.locations, function(location) {
			return location.name.toLowerCase().indexOf(search) >= 0;
		});
	}, locationsModel);

	ko.applyBindings(locationsModel);