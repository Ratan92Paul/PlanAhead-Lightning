({ 
	handleClick : function(component, event, helper) 
    {
        $('#tableDiv').css("display","none");
        $("#div").css("visibility","hidden");
        $("#chart").css("display","block");
        component.set("v.UserName", null);
        var arrayVar;
        var action = component.get("c.fetchAllTasks");
		action.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") {
            	component.set("v.taskRecords", response.getReturnValue());
                arrayVar = response.getReturnValue();
                var keys = Object.keys(arrayVar);
                var chart = c3.generate({
                data: {
                    json: arrayVar,
                    type: 'bar',
                    groups: [ keys],
                    onclick: function (d, element) 
                    {
                        //Setting component vars
                        component.set("v.UserName", d.name);
                        component.set("v.MonthNo", d.x);
                        console.log('=====inside click=========');
                        //calling event
						var cmpEvent = component.getEvent("C3JSComponentEvent");
                        cmpEvent.setParams({"UserName" : d.name});
                        cmpEvent.setParams({"MonthNo" : d.x});
                        cmpEvent.fire();
                    }
                },
                zoom: {
                    enabled: true
                },
                axis: {
        			x: {
                        type: 'category',
                        tick: {
                            rotate: -35,
                            multiline: false
                        },
                        extent: [0, 3],
                        height: 60,
                        categories: ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sep','Oct','Nov','Dec']
        			},
                    y: {
                        label: 'Number of Tasks'
                    }
    			}
            });  
            }
       });
       $A.enqueueAction(action);
    },
    
    getMonthTask : function(component, event, helper) 
    {
        var dt = new Date(2015, component.get("v.MonthNo") + 1, 0).getDate();
        var strCategory =new Array();
        var month = new Array();
        month[0] = "Jan";
        month[1] = "Feb";
        month[2] = "Mar";
        month[3] = "Apr";
        month[4] = "May";
        month[5] = "Jun";
        month[6] = "Jul";
        month[7] = "Aug";
        month[8] = "Sep";
        month[9] = "Oct";
        month[10] = "Nov";
        month[11] = "Dec";
        
        for(var i = 0; i < dt ; i++)
        {
			strCategory.push( month[component.get("v.MonthNo")] +' '+(i+1));
        }
    	var action1 = component.get("c.fetchMonthTasks");
    	action1.setParams({"strName" : component.get("v.UserName")  ,"intMonth": component.get("v.MonthNo") + 1 });
        action1.setCallback(this, function(a){
            var state = a.getState();
            if (state === "SUCCESS") {
                var arrayNew  = a.getReturnValue();
                var keys = Object.keys(arrayNew);
                var chart = c3.generate({
                    data: {
                        json: arrayNew,
                        type: 'bar',
                        groups: [ keys],
                        colors: {
                            Open: '#00ff00',
                            Completed: '#ff0000'
                        },
                        onclick: function (d, element) 
                        { 
                            component.set("v.taskStatus", d.name);
                            component.set("v.day", d.x);
                            var cmpEvent = component.getEvent("C3JSComponentEvent2");
                            cmpEvent.setParams({"day" : d.x});
                            cmpEvent.setParams({"taskStatus" : d.name});
                            cmpEvent.fire();                            
                        }
                    },
                    bar: {
                        width: {
                            ratio: 0.7
                        }
                    },
                    zoom: {
                        enabled: true
                    },
                    axis: {
                        x: {
                            extent: [0, 5],
                            type: 'category',
                            categories: strCategory
                        },
                        y:{
                            label: 'Number of Tasks'
                        }
                    }
            	});
            }
        });
        $('#chart').css("display","block");
       $('#tableDiv').css("display","none");
        $("#div").css("visibility","");
        document.getElementById("div").getElementsByTagName("button")[0].style.display = "block";
        document.getElementById("div").getElementsByTagName("button")[1].style.display = "none";
        $A.enqueueAction(action1);
	},    
    getDayTask : function(component, event, helper) 
    {
        document.getElementById("div").getElementsByTagName("button")[1].style.display = "block";
        document.getElementById("div").getElementsByTagName("button")[0].style.display = "none";
        $("#daybackId").css("display","block");
    	var action2 = component.get("c.fetchDayTasks");
    	action2.setParams({"strName" : component.get("v.UserName"), 
                           "strStatus": event.getParam("taskStatus"), 
                           "intMonth": component.get("v.MonthNo") + 1, 
                           "intDay": event.getParam("day") + 1}); 
        action2.setCallback(this, function(response2){
            var state = response2.getState();
            if (state === "SUCCESS") {
                component.set("v.tasks", response2.getReturnValue());
                $('#chart').toggle("slide");
                if ( $.fn.dataTable.isDataTable( '#table' ) ) {
                    table = $('#table').DataTable({
                         "paging":   false,"ordering": false,"info":false
                    });
                    }
                    else {
                        table = $('#table').DataTable( {
                             "paging":   false,"ordering": false,"info": false
                        } );
                    }

                $('#tableDiv').css("display","block");
            }
        });
        $A.enqueueAction(action2);
	},
    navigateToSObject :function(component, event, helper) 
    {
        console.log("=========");
    }
})