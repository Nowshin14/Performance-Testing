/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.3076923076923077, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "https://helpcenter.daraz.com.bd/page/knowledge?spm=a2a0e.tm80335411.header.8.676c79e0RIIeqN&pageId=11&category=1000001019-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://helpcenter.daraz.com.bd/page/knowledge?spm=a2a0e.tm80335411.header.9.676c79e0JHsUlC&pageId=11&category=1000001020-1"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.bd/#?"], "isController": false}, {"data": [0.0, 500, 1500, "https://helpcenter.daraz.com.bd/page/knowledge?spm=a2a0e.tm80335411.header.8.676c79e0RIIeqN&pageId=11&category=1000001019-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://helpcenter.daraz.com.bd/page/knowledge?spm=a2a0e.tm80335411.header.9.676c79e0JHsUlC&pageId=11&category=1000001020"], "isController": false}, {"data": [1.0, 500, 1500, "https://sellercenter.daraz.com.bd/v2/seller/login?spm=a2a0e.tm80335411.header.sell_on.676c79e0lA5heK-0"], "isController": false}, {"data": [0.0, 500, 1500, "https://helpcenter.daraz.com.bd/page/knowledge?spm=a2a0e.tm80335411.header.8.676c79e0RIIeqN&pageId=11&category=1000001019"], "isController": false}, {"data": [0.0, 500, 1500, "https://sellercenter.daraz.com.bd/v2/seller/login?spm=a2a0e.tm80335411.header.sell_on.676c79e0lA5heK"], "isController": false}, {"data": [0.0, 500, 1500, "https://pages.daraz.com.bd/wow/gcp/route/daraz/mm/upr/router?hybrid=1&data_prefetch=true&prefetch_replace=1&at_iframe=1&wh_pid=%2Flazada%2Fchannel%2Fbd%2Fflashsale%2F8r7TbxhpSH&hide_h5_title=true&lzd_navbar_hidden=true&disable_pull_refresh=true&skuIds=426884070%2C289582146%2C368374586%2C368394167%2C368378096%2C391193310%2C279165408&spm=a2a0e.tm80335411.FlashSale.d_shopMore"], "isController": false}, {"data": [0.0, 500, 1500, "Test"], "isController": true}, {"data": [0.0, 500, 1500, "https://sellercenter.daraz.com.bd/v2/seller/login?spm=a2a0e.tm80335411.header.sell_on.676c79e0lA5heK-1"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.bd/#hp-categories"], "isController": false}, {"data": [1.0, 500, 1500, "https://helpcenter.daraz.com.bd/page/knowledge?spm=a2a0e.tm80335411.header.9.676c79e0JHsUlC&pageId=11&category=1000001020-0"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 12, 0, 0.0, 6426.666666666667, 292, 23662, 3417.5, 22480.000000000004, 23662.0, 23662.0, 0.04949127097708141, 5.188161720203161, 0.04340555235351615], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://helpcenter.daraz.com.bd/page/knowledge?spm=a2a0e.tm80335411.header.8.676c79e0RIIeqN&pageId=11&category=1000001019-1", 1, 0, 0.0, 1409.0, 1409, 1409, 1409.0, 1409.0, 1409.0, 1409.0, 0.7097232079489, 15.181422995031937, 0.4830830819730305], "isController": false}, {"data": ["https://helpcenter.daraz.com.bd/page/knowledge?spm=a2a0e.tm80335411.header.9.676c79e0JHsUlC&pageId=11&category=1000001020-1", 1, 0, 0.0, 363.0, 363, 363, 363.0, 363.0, 363.0, 363.0, 2.7548209366391188, 58.71481146694215, 2.504627238292011], "isController": false}, {"data": ["https://www.daraz.com.bd/#?", 1, 0, 0.0, 23662.0, 23662, 23662, 23662.0, 23662.0, 23662.0, 23662.0, 0.042261854450173275, 20.732947671900092, 0.020511857091539177], "isController": false}, {"data": ["https://helpcenter.daraz.com.bd/page/knowledge?spm=a2a0e.tm80335411.header.8.676c79e0RIIeqN&pageId=11&category=1000001019-0", 1, 0, 0.0, 2713.0, 2713, 2713, 2713.0, 2713.0, 2713.0, 2713.0, 0.36859565057132326, 0.254849336527829, 0.2350517185772208], "isController": false}, {"data": ["https://helpcenter.daraz.com.bd/page/knowledge?spm=a2a0e.tm80335411.header.9.676c79e0JHsUlC&pageId=11&category=1000001020", 1, 0, 0.0, 813.0, 813, 813, 813.0, 813.0, 813.0, 813.0, 1.2300123001230012, 27.066276522140225, 2.0744445725707257], "isController": false}, {"data": ["https://sellercenter.daraz.com.bd/v2/seller/login?spm=a2a0e.tm80335411.header.sell_on.676c79e0lA5heK-0", 1, 0, 0.0, 292.0, 292, 292, 292.0, 292.0, 292.0, 292.0, 3.4246575342465753, 2.819322559931507, 1.912992294520548], "isController": false}, {"data": ["https://helpcenter.daraz.com.bd/page/knowledge?spm=a2a0e.tm80335411.header.8.676c79e0RIIeqN&pageId=11&category=1000001019", 1, 0, 0.0, 4122.0, 4122, 4122, 4122.0, 4122.0, 4122.0, 4122.0, 0.242600679281902, 5.357115781174188, 0.31983487991266374], "isController": false}, {"data": ["https://sellercenter.daraz.com.bd/v2/seller/login?spm=a2a0e.tm80335411.header.sell_on.676c79e0lA5heK", 1, 0, 0.0, 5197.0, 5197, 5197, 5197.0, 5197.0, 5197.0, 5197.0, 0.19241870309794112, 5.939424187030979, 0.22323576101597076], "isController": false}, {"data": ["https://pages.daraz.com.bd/wow/gcp/route/daraz/mm/upr/router?hybrid=1&data_prefetch=true&prefetch_replace=1&at_iframe=1&wh_pid=%2Flazada%2Fchannel%2Fbd%2Fflashsale%2F8r7TbxhpSH&hide_h5_title=true&lzd_navbar_hidden=true&disable_pull_refresh=true&skuIds=426884070%2C289582146%2C368374586%2C368394167%2C368378096%2C391193310%2C279165408&spm=a2a0e.tm80335411.FlashSale.d_shopMore", 1, 0, 0.0, 13480.0, 13480, 13480, 13480.0, 13480.0, 13480.0, 13480.0, 0.07418397626112759, 9.458746754451038, 0.07606755378338279], "isController": false}, {"data": ["Test", 1, 0, 0.0, 66996.0, 66996, 66996, 66996.0, 66996.0, 66996.0, 66996.0, 0.014926264254582364, 17.657828918890683, 0.09492171174398473], "isController": true}, {"data": ["https://sellercenter.daraz.com.bd/v2/seller/login?spm=a2a0e.tm80335411.header.sell_on.676c79e0lA5heK-1", 1, 0, 0.0, 4898.0, 4898, 4898, 4898.0, 4898.0, 4898.0, 4898.0, 0.2041649652919559, 6.133921051959984, 0.12281798693344223], "isController": false}, {"data": ["https://www.daraz.com.bd/#hp-categories", 1, 0, 0.0, 19722.0, 19722, 19722, 19722.0, 19722.0, 19722.0, 19722.0, 0.05070479667376534, 24.843468746830947, 0.03466148210120677], "isController": false}, {"data": ["https://helpcenter.daraz.com.bd/page/knowledge?spm=a2a0e.tm80335411.header.9.676c79e0JHsUlC&pageId=11&category=1000001020-0", 1, 0, 0.0, 449.0, 449, 449, 449.0, 449.0, 449.0, 449.0, 2.2271714922048997, 1.539880289532294, 1.7312778396436526], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 12, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
