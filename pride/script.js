var TAU = Math.PI * 2;

var config = {
    space: 32,
    lineWidth: 34,
    colors: [ 
      "rgb( 228, 3, 3 )", 
      "rgb( 255, 140, 0 )", 
      "rgb( 255, 237, 0 )", 
      "rgb( 0, 128, 38 )" ,
      "rgb( 0, 77, 255 )",
      "rgb( 117, 7, 135 )"
    ],
    backgroundColor: "#ffffff",
    tailDelay: 0.5,
    timeDelta: 0.01,
    size: 500
};

var canvas = document.getElementById( "canvas" );
var context = canvas.getContext( "2d" );
var center = config.size / 2;
var lines;
var time = 0;

function init() {
    refresh();
    updateBackground();

    requestAnimationFrame( render );
}

function updateBackground() {
    document.body.style.backgroundColor = config.backgroundColor;
}

function refresh() {
    lines = [];
    center = config.size / 2;

    var amount = ~~( ( center - 50 ) / config.space );
    var max = center - 50;

    for (var i = 0; i < amount; i++) {
        lines.push( circle( ( 1 - i / amount ) * max, i / ( amount * 2 ) ) );
    };
}

function clear() {
    canvas.width = config.size;
    canvas.height = config.size;
}

function render() {
    clear();

    context.translate( center, center );
    context.rotate( - TAU / 4 );
    context.translate( -center, -center );
    context.lineWidth = config.lineWidth;

    lines.forEach( function( line, i ) {
        context.beginPath();
        context.strokeStyle = config.colors[ i ];
        line.draw( time );
        context.stroke();
    } );

    time += config.timeDelta;
    time %= 1;

    requestAnimationFrame( render );
}

function getCartesian( angle, distance ) {
    return {
        x: Math.cos( angle ) * distance,
        y: Math.sin( angle ) * distance
    };
}

function ease( t ) {
    return 1 - ( Math.cos( t * Math.PI ) / 2 + 0.5 );
}

function circle( radius, delay ) {

    function getTailValue( t ) {
        var s = t - config.tailDelay;

        if ( s < 0 ) s += 1;

        return Math.pow( ease( s ), 2 ) * TAU;
    }

    function getHeadValue( t ) {
        return Math.pow( ease( t ), 2 ) * TAU;
    }

    return {
        draw: function( t ) {
            t -= delay;

            if ( t < 0 ) t += 1;

            var tailAngle = getTailValue( t );
            var tail = getCartesian( tailAngle, radius );

            context.moveTo( center + tail.x, center + tail.y );
            context.arc( center, center, radius, tailAngle, getHeadValue( t ) );
        }
    }
}

init();