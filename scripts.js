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

function processingWidget_DependenciesLoaded() {
  return (
    true
  )
}

function processingWidget_ConstructUI(node) {
  var data = processingWidget_GrabData();
  console.log("Got Data", data);
  console.log("Constructing widget with settings", data.settings);
  for (var i = 0; i < data.data.length; i++) {
    var point = data.data[i];
    for (var j = 0; j < data.transformations.length; j++) {
      var transformation = data.transformations[j];
      console.log("Data", point, "Transformation", transformation);
    }
  }
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
  var settings = CTS('processingDatasource|data!rows').nodes[0].toJson()[0];

  // transformations: an array of arrays
  var transformations = CTS('processingDatasource|transformations!rows').nodes[0].parentNode.cellFeedNode.getCsv();

  return {
    data: data,
    settings: settings,
    transformations: transformations
  };
}
