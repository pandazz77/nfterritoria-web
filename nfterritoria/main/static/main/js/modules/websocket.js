var socket = new WebSocket(WEBSOCKET);

function handle_received_data(data){
    //try{
        parsed_data = JSON.parse(data);

        if(parsed_data["type"]=="check_whitelist_result"){
            let result = parsed_data["result"];
            let whitelist_img_no = document.getElementById("whitelist_img_no");
            let whitelist_img_yes = document.getElementById("whitelist_img_yes");
            if(result){
                whitelist_img_no.setAttribute("style","display: none;");
                whitelist_img_yes.setAttribute("style","display: flex;");
            } else{
                whitelist_img_yes.setAttribute("style","display: none;");
                whitelist_img_no.setAttribute("style","display: flex;");
            }
        }

        else if(parsed_data["type"]=="get_stored_tokens_result"){
            let tokens = {
                "CKTERR":0,
                "PGTERR":0,
                "CWTERR":0,
                "OCTERR":0,
                "RSTERR":0,
                "FCTERR":0,
                "FDTERR":0,
              };
            
            let tokens_data = parsed_data["tokens"];
            for(let key in tokens_data){
                tokens[key] = tokens_data[key];
            }
            document.getElementById("Chicken_staked").textContent = tokens["CKTERR"];
            document.getElementById("Pig_staked").textContent = tokens["PGTERR"];
            document.getElementById("Cow_staked").textContent = tokens["CWTERR"];
            document.getElementById("Ocelot_staked").textContent = tokens["OCTERR"];
            document.getElementById("Redstone_staked").textContent = tokens["RSTERR"];
            document.getElementById("Furnace_staked").textContent = tokens["FCTERR"];
            document.getElementById("Founder_staked").textContent = tokens["FDTERR"];
        }


    // } catch(e){
    //     console.log(e);
    // }
}

socket.onopen = function() {
    console.log("Connection established .");
};
    
socket.onclose = function(event) {
    if (event.wasClean) {
        console.log('Connection cleanly closed.');
    } else {
        console.log('Lost connection.');
    }
    Swal.fire(
        "WebSocket connection error. Code: "+event.code,
        "Please reload the page.",
        "error"
    )
    console.log('Code: ' + event.code + ' reason: ' + event.reason);
};
    
socket.onmessage = function(event) {
    console.log("Received data: " + event.data);
    handle_received_data(event.data);
};
    
socket.onerror = function(error) {
    console.log("Error: " + error.message);
    Swal.fire(
        "WebSocket connection error. Message: "+error.message,
        "Please reload the page.",
        "error"
    )
};