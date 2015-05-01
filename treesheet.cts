/*
 * Treesheet
 * ---------
 * 
 * This file enables your Cloudstitch app to be injected into 
 * a page as a widget. To do so, simply include cloudstitch.js 
 * in the web page HEAD: 
 * 
 *   <script src="http://cloudstitch.io/release/cloudstitch.js"></script>
 * 
 * And then invoke the widget like this:
 *
 *   <div widget="ted/processing-experiment"></div>
 *
 */

@html ted-processing-experiment relative(widget.html);
@js relative(scripts.js);
@css relative(styles.css);
@gsheet processingDatasource http://cloudstitch.io/ted/processing-experiment/datasource/processingDatasource;
body|*[processingwidget="ted/processing-experiment"] {"after": "processingWidget_Init"} :graft ted-processing-experiment|#widget-container;