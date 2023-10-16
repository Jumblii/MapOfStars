//const { image } = require("d3");
var map = undefined;
const latLong = {lat: 53.4084, lng: -2.983333};
var config = {
    width: 0,     // Default width, 0 = full parent width; height is determined by projection
    projection: "aitoff",  // Map projection used: airy, aitoff, armadillo, august, azimuthalEqualArea, azimuthalEquidistant, baker, berghaus, boggs, bonne, bromley, collignon, craig, craster, cylindricalEqualArea, cylindricalStereographic, eckert1, eckert2, eckert3, eckert4, eckert5, eckert6, eisenlohr, equirectangular, fahey, foucaut, ginzburg4, ginzburg5, ginzburg6, ginzburg8, ginzburg9, gringorten, hammer, hatano, healpix, hill, homolosine, kavrayskiy7, lagrange, larrivee, laskowski, loximuthal, mercator, miller, mollweide, mtFlatPolarParabolic, mtFlatPolarQuartic, mtFlatPolarSinusoidal, naturalEarth, nellHammer, orthographic, patterson, polyconic, rectangularPolyconic, robinson, sinusoidal, stereographic, times, twoPointEquidistant, vanDerGrinten, vanDerGrinten2, vanDerGrinten3, vanDerGrinten4, wagner4, wagner6, wagner7, wiechel, winkel3
    projectionRatio: null, // Optional override for default projection ratio
    transform: "equatorial", // Coordinate transformation: equatorial (default), ecliptic, galactic, supergalactic
    center: null,       // Initial center coordinates in equatorial transformation [hours, degrees, degrees],
                        // otherwise [degrees, degrees, degrees], 3rd parameter is orientation, null = default center
    orientationfixed: true,  // Keep orientation angle the same as center[2]
    background: { fill: "#000000", stroke: "#000000", opacity: 1 }, // Background style
    adaptable: true,    // Sizes are increased with higher zoom-levels
    interactive: true,  // Enable zooming and rotation with mousewheel and dragging
    disableAnimations: false, // Disable all animations
    form: false,        // Display settings form
    location: false,    // Display location settings
    controls: true,     // Display zoom controls
    lang: "",           // Language for names, so far only for constellations: de: german, es: spanish
                        // Default:en or empty string for english
    container: "celestial-map",   // ID of parent element, e.g. div
    datapath: "../d3-celestial-master/data",  // Path/URL to data files, empty = subfolder 'data'
    stars: {
      show: true,    // Show stars
      limit: 6,      // Show only stars brighter than limit magnitude
      colors: true,  // Show stars in spectral colors, if not use "color"
      style: { fill: "#ffffff", opacity: 1 }, // Default style for stars
      names: false,   // Show star names (Bayer, Flamsteed, Variable star, Gliese, whichever applies first)
      proper: false, // Show proper name (if present)
      desig: false,  // Show all names, including Draper and Hipparcos
      namelimit: 2,  // Show only names for stars brighter than namelimit
      namestyle: { fill: "#ddddbb", font: "8px Georgia, Times, 'Times Roman', serif", align: "left", baseline: "top" },
      propernamestyle: { fill: "#ddddbb", font: "8px Georgia, Times, 'Times Roman', serif", align: "right", baseline: "bottom" },
      propernamelimit: 1.5,  // Show proper names for stars brighter than propernamelimit
      size: 6,       // Maximum size (radius) of star circle in pixels
      exponent: -0.38, // Scale exponent for star size, larger = more linear
      data: 'stars.6.json' // Data source for stellar data
      //data: 'stars.8.json' // Alternative deeper data source for stellar data
    },
    dsos:{
      show:false
    },
    planets: {  //Show planet locations, if date-time is set
        show: false,
        // List of all objects to show
        which: ["sol", "lun", "mer", "ven", "ter", "mar", "jup", "sat", "ura", "nep"],
        //which: ["mer", "ven", "ter", "mar", "jup", "sat", "ura", "nep"],
        // Font styles for planetary symbols
        symbols: {  // Character and color for each symbol in 'which' above (simple circle: \u25cf), optional size override for Sun & Moon
          "sol": {symbol: "\u2609", letter:"Su", fill: "#ffff00", size:""},
          "mer": {symbol: "\u263f", letter:"Me", fill: "#cccccc"},
          "ven": {symbol: "\u2640", letter:"V", fill: "#eeeecc"},
          "ter": {symbol: "\u2295", letter:"T", fill: "#00ccff"},
          "lun": {symbol: "\u25cf", letter:"L", fill: "#ffffff", size:""}, // overridden by generated crecent, except letter & size
          "mar": {symbol: "\u2642", letter:"Ma", fill: "#ff6600"},
          "cer": {symbol: "\u26b3", letter:"C", fill: "#cccccc"},
          "ves": {symbol: "\u26b6", letter:"Ma", fill: "#cccccc"},
          "jup": {symbol: "\u2643", letter:"J", fill: "#ffaa33"},
          "sat": {symbol: "\u2644", letter:"Sa", fill: "#ffdd66"},
          "ura": {symbol: "\u2645", letter:"U", fill: "#66ccff"},
          "nep": {symbol: "\u2646", letter:"N", fill: "#6666ff"},
          "plu": {symbol: "\u2647", letter:"P", fill: "#aaaaaa"},
          "eri": {symbol: "\u26aa", letter:"E", fill: "#eeeeee"}
        },
        symbolStyle: { fill: "#00ccff", font: "bold 17px 'Lucida Sans Unicode', Consolas, sans-serif", 
                 align: "center", baseline: "middle" },
        symbolType: "symbol",  // Type of planet symbol: 'symbol' graphic planet sign, 'disk' filled circle scaled by magnitude
                               // 'letter': 1 or 2 letters S Me V L Ma J S U N     
        names: false,          // Show name in nameType language next to symbol
        nameStyle: { fill: "#00ccff", font: "14px 'Lucida Sans Unicode', Consolas, sans-serif", align: "right", baseline: "top" },
        namesType: "desig"     // Language of planet name (see list below of language codes available for planets), 
                               // or desig = 3-letter designation
      },
    constellations: {
      show: false,    // Show constellations
      names: false,   // Show constellation names
      desig: false,   // Show short constellation names (3 letter designations)
      namestyle: { fill:"#cccc99", align: "center", baseline: "middle", opacity:0.6,
                   font: ["bold 10px Helvetica, Arial, sans-serif",  // Different fonts for brighter &
                          "bold 10px Helvetica, Arial, sans-serif",  // sdarker constellations
                          "bold 10px Helvetica, Arial, sans-serif"]},
      lines: false,   // Show constellation lines
      linestyle: { stroke: "#cccccc", width: 1, opacity: 0.6 },
      bounds: false,  // Show constellation boundaries
      boundstyle: { stroke: "#cccc00", width: 0.5, opacity: 0.8, dash: [2, 4] }
    },
    mw: {
      show: false,    // Show Milky Way as filled polygons
      style: { fill: "#ffffff", opacity: "0.15" }
    },
    lines: {
      graticule: { show: false, stroke: "#cccccc", width: 0.6, opacity: 0.8,      // Show graticule lines
        // grid values: "outline", "center", or [lat,...] specific position
        lon: {pos: [""], fill: "#eee", font: "10px Helvetica, Arial, sans-serif"},
        // grid values: "outline", "center", or [lon,...] specific position
        lat: {pos: [""], fill: "#eee", font: "10px Helvetica, Arial, sans-serif"}},
      equatorial: { show: false, stroke: "#aaaaaa", width: 1.3, opacity: 0.7 },    // Show equatorial plane
      ecliptic: { show: false, stroke: "#66cc66", width: 1.3, opacity: 0.7 },      // Show ecliptic plane
      galactic: { show: false, stroke: "#cc6666", width: 1.3, opacity: 0.7 },     // Show galactic plane
      supergalactic: { show: false, stroke: "#cc66cc", width: 1.3, opacity: 0.7 } // Show supergalactic plane
  }};

var starNames = false;
var milkyWay = false;
var planets = false;
var eclip = false;

function applyConst()
{
  const cLines = document.getElementById("cLines").checked;
  const cBorders = document.getElementById("cBorders").checked;
  const cNames = document.getElementById("cNames").checked;

  if(cNames&&(cLines||cBorders))
  {
    Celestial.apply({"constellations":{ show: cLines, 
                                        names:true,
                                        namesType:"en",
                                        lines: cLines,
                                        bounds: cBorders} });
  } else if(cLines||cBorders)
    {
      Celestial.apply({"constellations":{ show: cLines, 
                                          names:true,
                                          namesType:"desig",
                                          lines: cLines,
                                          bounds: cBorders} });
    }
    else 
      {
        Celestial.apply({"constellations":{ show: false, 
                                            names:false,
                                            lines: false,
                                            bounds: false} });
      }
  
}
function togStarNames()
{
    if(!starNames)
    {
      Celestial.display({"stars":{proper:true}});
      starNames=true;
    } else 
        {
          Celestial.display({"stars":{proper:false}});
          starNames=false;
        }
}
function togPlanets()
{
  var pLetters = document.getElementById("pLetters").checked;
  var pSymbols = document.getElementById("pSymbols").checked;
  var pDisks = document.getElementById("pDisks").checked;
  var symType = "symbol";
  if(pLetters) {symType="letter";}
  else if(pSymbols) {symType="symbol";}
  else if(pDisks) {symType="disk";}


  if(!planets)
  {
    Celestial.apply({"planets":{show:true,
                                symbolType:symType}});
    planets=true;
  } else
    {
      Celestial.apply({"planets":{show:false}});
      planets=false;
    }

}
function togMilkyWay()
{
    if(!milkyWay)
    {
        Celestial.apply({"mw":{show:true}});
        milkyWay=true;
    } else
        {
            Celestial.apply({"mw":{show:false}});
            milkyWay=false;
        }
}
function reset()
{
  Celestial.display(config);
  Celestial.skyview({location:[53.4084, -2.983333]})  
  map.panTo(latLong);
}

function download()
{
    ReImg.fromCanvas(document.querySelector('canvas')).downloadPng();
}


function changeDate()
{
  const date = new Date(Date.parse(document.getElementById("datePicker").value));
  Celestial.skyview({date:date});
}


function initMap()
     {
      
      map = new google.maps.Map(document.getElementById("gMap"),
          {
          center: latLong,
          zoom: 8,
          disableDefaultUI: true
          });
      map.addListener("click", (mapsMouseEvent) => 
          {
            //console.log("clicked!");
            lat = mapsMouseEvent.latLng.toJSON().lat;
            lng = mapsMouseEvent.latLng.toJSON().lat;
            //console.log(mapsMouseEvent.latLng.toJSON().lat);
            //console.log(mapsMouseEvent.latLng.toJSON().lat);
            Celestial.skyview({location:[lat, lng]})
          });
     }

