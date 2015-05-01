var obj = [];
var w = 0;
var h = 0;
var opts = [
    ["fill", "255"],
    ["stroke", "200"],
    ["ellipse", "col(Families)", "col(Adults)",10,10],
    ["fill", "([255,100,25])"],
    ["rect","col(Total)","col(Total)","col(Total)","col(Families)"],
    ["bezier","col(Total)","col(Total)",0,0,"col(Families)","col(Families)",1000,1000]
];
var colors = [
    [108, 122, 137],
    [108, 122, 137],
    [108, 122, 137],
    [108, 122, 137],
    [108, 122, 137],
    [108, 122, 137],
    [210, 77, 87],
    [210, 77, 87],
    [210, 77, 87],
    [210, 77, 87],
    [247, 202, 24]
];
Object.size = function(obj) {
    var size = 0,
        key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};
var dataLength = Object.size(data);

jQuery(function($) {
    w = $(".chartContainer").width();
    h = $(".chartContainer").height();
    setInterval(function() {
        w = jQuery(".chartContainer").width();
        h = jQuery(".chartContainer").height();
    }, 20);
});




function setup() {
    createCanvas(1600, 600);
    for (var i = 0; i < dataLength; i++) {
        obj[i] = new Obj(data[i]);
    }
    frameRate(20);
}

function draw() {
    background([40, 40, 40]);
    noStroke();
    for (var i = 0; i < data.length; i++) {
        obj[i].run();
    }

}



function Obj(d) {
    this.d = d;
}


Obj.prototype.run = function() {
    for (i = 0; i < opts.length; i++) {
        var all = [];
        for (j = 1; j < opts[i].length; j++) {
            if (opts[i][j] > -9999999) {
                all.push(opts[i][j]);
            } else if (opts[i][j].indexOf("col") == -1) {
                all.push(opts[i][j]);
            } else {
                all.push(this.d[eval("'" + opts[i][j].replace("col(", "").replace(")", "") + "'" )]);
            }
        }
        eval("" + opts[i][0] + "(" + all.join(",") + ")" );
    }
}
