/* Constructs the widget.
 * Args:
 *   ctsTarget - the CTS Node the widget is being constructed in.
 *   ctsSource - the CTS Node that represents the widget being copied
 *   ctsRelation - the CTS Relation that caused this invocation
 * 
 */
function processingWidget_Init(ctsTarget, ctsSource, ctsRelation) {
  console.log("processingWidget :: Init");
  var widgetContainerNode = ctsTarget.value;
  var tryIt = function() {
    if (processingWidget_DependenciesLoaded()) {
      processingWidget_ConstructUI(widgetContainerNode);
    } else {
      setTimeout(tryIt, 100);
    }
  }
  tryIt();
}

function Datapoint(d) {
  this.d = d;
}

function processingWidget_DependenciesLoaded() {
  return (
    true
  )
}

function processingWidget_ConstructUI(node) {
  var data = processingWidget_GrabData();

  function parseVal(ctx, val) {
    if (isNaN(parseFloat(val))) {
      if (val.indexOf("col") == -1) {
        return parseFloat(val);
      } else {
        return ctx[eval("'" + val.replace("col(", "").replace(")", "") + "'" )];
      }
    } else {
      val = parseFloat(val);
    }
    return val;
  }

  // Now that we have the transformations, we can set the
  // run finction on the datapoint.
  Datapoint.prototype.run = function() {
    for (var j = 0; j < data.transformations.length; j++) {
      var transformation = data.transformations[j];

      if (transformation.length > 0) {
        // There's a command to run.
        var all = [];
        if (transformation.length > 1) {
          var k = 1;
          while ((k < transformation.length) && (typeof transformation[k] != 'undefined')) {
            all.push(parseVal(this.d, transformation[k]));
            k++;            
          }
        }
        var cmd = transformation[0] + "(" + all.join(",") + ")";
        eval(cmd);
      }
    }
  };

  // And now we do it.
  data.smartDatapoints = [];
  for (var i = 0; i < data.data.length; i++) {
    data.smartDatapoints.push(new Datapoint(data.data[i]));
  }

  window.draw = function() {
    background([40, 40, 40]);
    for (var i = 0; i < data.smartDatapoints.length; i++) {
      data.smartDatapoints[i].run();
    }
  }
  window.setup = function() {
    createCanvas(parseInt(data.settings.Width), parseInt(data.settings.Height));
    frameRate(parseInt(data.settings.frameRate));    
  }

  // Now add processing to the page
  var p5 = document.createElement('script');
  p5.setAttribute('src','p5.min.js');
  document.head.appendChild(p5);

  CTS.Util.$(function($) {
    w = CTS.Util.$(node).width();
    h = CTS.Util.$(node).height();
    setInterval(function() {
        w = CTS.Util.$(node).width();
        h = CTS.Util.$(node).height();
    }, 20);
  });

}

/*
 * Assumptions:
 *   Spreadsheet label is: processingDatasource
 *   Spreadsheet has worksheets: data, transformations, settings
 */
function processingWidget_GrabData() {
  // data: an array of objects
  var data = CTS('processingDatasource|data!rows').nodes[0].toJson();

  // settings: a single object
  var settings = CTS('processingDatasource|settings!rows').nodes[0].toJson()[0];

  // transformations: an array of arrays
  var transformations = CTS('processingDatasource|transformations!rows').nodes[0].parentNode.cellFeedNode.getCsv();
  return {
    data: data,
    settings: settings,
    transformations: transformations
  };
}
