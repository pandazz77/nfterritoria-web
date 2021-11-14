async function sendRequest(method,url,body){
    var xhttp = new XMLHttpRequest();
    var result;
    xhttp.open(method,url,false)
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
    xhttp.onreadystatechange = function(){
      //console.log(xhttp.status)
      if (xhttp.status == 200) {
        var response = xhttp.responseText
        //console.log(response)
        //console.log(typeof response)
        if (response!=""){
          result = JSON.parse(response)
        } else {
          console.log(response)
          result = null
        }
  
      } else{
        console.log("Error!")
        console.log(xhttp.responseText)
        result = null
      }
    };
    xhttp.send(JSON.stringify(body))
    return result
}

async function send_data_to_ws(data){
    socket.send(data);
}

async function randomString(len, charSet) {
    charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var randomString = '';
    for (var i = 0; i < len; i++) {
        var randomPoz = Math.floor(Math.random() * charSet.length);
        randomString += charSet.substring(randomPoz,randomPoz+1);
    }
    return randomString;
}

async function get_assets(collection_name,template_id){
    if(!wax.api | !wax.userAccount) {
      return document.getElementById('account').textContent = '* Login first *'
    }
    const result = []
    const body = { //{"code":"atomicassets","index_position":1,"json":True,"key_type":"","limit":10,"lower_bound":0,"reverse":False,"scope":account,"show_payer":False,"table":"assets","table_key":"","upper_bound":""}
      code:"atomicassets",
      index_position:1,
      json:true,
      key_type:"",
      limit:99999,
      lower_bound:"",
      reverse:false,
      scope:wax.userAccount,
      show_payer:false,
      table:"assets",
      table_key:"",
      upper_bound:""
    }
    var assets_data = await sendRequest("POST",API+"/v1/chain/get_table_rows",body)
    console.log("json_response:")
    console.log(assets_data)
    for(const row of assets_data["rows"]){
      //console.log(row)
      if(row["collection_name"] == collection_name){
        if(row["template_id"] == template_id){
          console.log(row["asset_id"]);
          result.push(row["asset_id"]);
        }
      }
    }
    return result;
}

async function get_tokens(){
    if(!wax.api | !wax.userAccount){
        return document.getElementById('account'.textContent = '* Login first *');
    }

    const tokens_data = await sendRequest("GET",tAPI+"/v2/state/get_tokens?account="+wax.userAccount);
    return tokens_data["tokens"];
}

async function transfer_tokens(tokens){
    if(!wax.api | !wax.userAccount){
      return document.getElementById('account'.textContent = '* Login first *');
    }
  
    // try{
      const result = await wax.api.transact({
        actions:[{
          account: TOKENS_ACCOUNT_NAME,
          name: 'transfer',
          authorization: [{
            actor: wax.userAccount,
            permission: 'active',
          }],
          data: {
            from: wax.userAccount,
            to: ACCOUNT_NAME,
            quantity: tokens,
            memo: 'craft'
          },
        }]
      },{
        blocksBehind: 3,
        expireSeconds: 90
      });
      result_json = JSON.stringify(result)
      console.log(result_json);
      return result_json;
    // } catch(e){
    //   document.getElementById('response').textContent = e.message;
    // }
}

async function transfer_assets(asset_ids){
    if(!wax.api | !wax.userAccount) {
      return document.getElementById('account').textContent = '* Login first *';
    }
    
    // try {
      const result = await wax.api.transact({
        actions: [{
          account: 'atomicassets',
          name: 'transfer',
          authorization: [{
            actor: wax.userAccount,
            permission: 'active',
          }],
          data: {
            from: wax.userAccount,
            to: ACCOUNT_NAME,
            asset_ids: asset_ids,
            memo: "transferred by nftmine"
          },
        }]
      }, {
        blocksBehind: 3,
        expireSeconds: 90
      });
      //document.getElementById('response').textContent = JSON.stringify(result)
      result_json = JSON.stringify(result)
      console.log(result_json);
      return result_json;
  
    // } catch(e) {
    //   document.getElementById('response').textContent = e.message;
    // }
}