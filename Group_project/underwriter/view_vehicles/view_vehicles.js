const vehicles=[
    {
        underWriterId:"UW101",
        policy:"P1001",
        vehicle:"KL12AB1234",
        customer:"Rahul Sharma",
        type:"Comprehensive",
        premium:"Rs 12500"
    },
    {
        underWriterId:"UW101",
        policy:"P1002",
        vehicle:"KL12AB3234",
        customer:"Amit Sharma",
        type:"Third Party",
        premium:"Rs 9000"
    },
   { underWriterId:"UW102",
        policy:"P1003",
        vehicle:"KL12AB4321",
        customer:"Priya Das",
        type:"Comprehensive",
        premium:"Rs 15000"
    },
     { underWriterId:"UW102",
        policy:"P1004",
        vehicle:"KL12AB4328",
        customer:"Riya Das",
        type:"Comprehensive",
        premium:"Rs 19000"
    },
     { underWriterId:"UW103",
        policy:"P1005",
        vehicle:"KL12AB8768",
        customer:"Ritika Das",
        type:"Third party",
        premium:"Rs 15000"
    },
];
function searchVehicle(){
    const id = document.getElementById("underwriterId").value.trim();
    const table = document.getElementById("vehicleTable");
    table.innerHTML = "";
    const result=vehicles.filter(function(v){
        return v.underWriterId===id});
    if(result.length===0){
        table.innerHTML=` 
        <tr> 
        <td colspan="5">
        No Vehicle Found
        </td>
        </tr>`;
        return;
        
    }
    result.forEach(function(v){
        table.innerHTML+=`
        <tr> 
        <td>${v.policy}</td>
        <td>${v.vehicle}</td>
        <td>${v.customer}</td>
        <td>${v.type}</td>
        <td>${v.premium}</td>
        </tr>
        `;
    });

}