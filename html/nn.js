var datamap={};

var test="";

var colorscale=["#00FF00","#FFFF00","#FF0000"]

function hex_to_rgb(hx) {
    var c=parseInt(hx.replace("#",""),16);
    var red=c>>16 &0xFF;
    var green=c>>8 &0xFF;
    var blue=c & 0xFF;
    return ([red,green,blue]);
    }

function number_length(n,l) {
    while (n.length<l) {
        n="0"+n
        }
    return n    
    }
function rgb_to_hex(rgb) {
    var c=rgb[0]<<16 | rgb[1] <<8 | rgb[2];
    return ("#"+number_length(c.toString(16),6));
    }

function rgb_diff(a,b) {
    return ([a[0]-b[0],a[1]-b[1],a[2]-b[2]])
    }

function rgb_div(a,d) {
    return ([a[0]/d,a[1]/d,a[2]/d])
    }

function rgb_mult(a,d) {
    return ([a[0]*d,a[1]*d,a[2]*d])
    }

function rgb_add(a,b) {
    return([a[0]+b[0],a[1]+b[1],a[2]+b[2]])
    }

function map_value_to_color(value,min,max,mincolor,maxcolor) {
    var minc=hex_to_rgb(mincolor);
    var maxc=hex_to_rgb(maxcolor);
    var cv=rgb_diff(maxc,minc);
    var vd=(value-min)/(max-min);
    var rc=rgb_add(minc,rgb_mult(cv,vd))
    return rgb_to_hex(rc)
    }

function dorange(min,max,step) {
    var r=[];
    for (var i=min; i<=max; i=i+step) {
        r.push(i)
        }
    return (r);    
    }

function map_value_to_range(value,min,max,range) {
    var vstep=(max-min)/(range.length-1);
    var vr=dorange(min,max,vstep);
    var r;
    for (var i=0; i<range.length; i++) {
        if ((vr[i]<=value) && (vr[i+1]>=value)) {
            r=map_value_to_color(value,vr[i],vr[i+1],range[i],range[i+1]);
            }
        }
    return (r);    
    }

function testlist() {
    $.get("json/tests.json", function(data) {
        for (i in data) {
            $("#testselector").append("<option value="
                +data[i]+">"+data[i]+"</option>");
                }
        })
    }

function period() {
    $.get("json/period.json",function (data) {
        $("#period-begin").html(data["begin"]);
        $("#period-end").html(data["end"]);
        }
        )
    }
function selecttest() {
    test=$("#testselector").val();
    loaddata();
};


function loaddata () {
    var url;
    if (test) {
        url="json/countries-"+test+".json";
        }
    else {
        url="json/countries.json";
        }
        
    $.get(url,function(data) {
        datamap={};
        for (c in data) {
            if (data[c].cc !="BB") {
                datamap[data[c].cc]=data[c].percent+1; 
                }
            }
        $('#world-map').html("")            
        $('#world-map').vectorMap({
            map: 'world_mill_en',
            series: {
                regions: [{
                    values: datamap,
                    scale: colorscale,
                    attribute: 'fill',
                    min: 1,
                    max: 101
                }]
                },
            onRegionClick: function (e,str) { loadcountryinfo(str); }    
            })
            })
            }

function loadcountryinfo(cc) {
    var url;
    if (test) {
        url="json/country-"+cc+"-"+test+".json";
        }
    else {
        url="json/country-"+cc+".json";
        };
    $.get(url, function(data ) {
        var html=["<h1>"+cc+"</h1>","<table>",
        "<tr><th>Provider</th><th>Total tests</th><th>Shaped tests</th><th>Percent tests shaped</th></tr>"]
        for (i in data) {
            var c=map_value_to_range(data[i].percent,0,100,colorscale);
            html.push("<tr><td>",data[i].provider,"</td><td>",data[i].total,
            "</td><td>",data[i].shaped,"</td><td style='background: "+c+"'>",data[i].percent,"%</td></tr>")
        }
        html.push("</table>")
        $("#countryinfo").html(html.join(""));
        
        })
    }

$(document).ready(function () { testlist(); period(); loaddata() })
