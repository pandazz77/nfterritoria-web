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

async function transact(data){
  let c = 0;
  function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }
  if(wax.api || wax.userAccount){
    const result = await wax.api.transact(data,{
      blocksBehind: 3,
      expireSeconds: 90
    })
    return JSON.stringify(result);
  }
  if(session){
    let c = 0;
    let transaction_result;
    const actions = data["actions"]
    console.log(actions)
    session.transact({actions}).then((result) => {
      transaction_result = JSON.stringify(result.processed)
    })
    while(c<240){
      await sleep(1000);
      if(transaction_result) return transaction_result;
      console.log("sleeping...")
      c++;
    }
  }
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
    if(wax.api || wax.userAccount ||session) {

      const result = []
      const body = { //{"code":"atomicassets","index_position":1,"json":True,"key_type":"","limit":10,"lower_bound":0,"reverse":False,"scope":account,"show_payer":False,"table":"assets","table_key":"","upper_bound":""}
        code:"atomicassets",
        index_position:1,
        json:true,
        key_type:"",
        limit:99999,
        lower_bound:"",
        reverse:false,
        scope:wallet_name.textContent,
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
}

async function get_tokens(){
  if(wax.api || wax.userAccount ||session){
    const tokens_data = await sendRequest("GET",tAPI+"/v2/state/get_tokens?account="+wallet_name.textContent);
    console.log(tokens_data);
    return tokens_data["tokens"];
  }
}

async function transfer_tokens(tokens){
  if(wax.api || wax.userAccount ||session){

    if(wax.api) authorization = [{
      actor: wallet_name.textContent,
      permission: 'active',
    }]
    if(session) authorization = [session.auth]
    const result = await transact({
      actions:[{
        account: TOKENS_ACCOUNT_NAME,
        name: 'transfer',
        authorization: authorization,
        data: {
          from: wallet_name.textContent,
          to: ACCOUNT_NAME,
          quantity: tokens,
          memo: 'craft'
        },
      }]
    })
    console.log(result)
    return result;
  // } catch(e){
  //   document.getElementById('response').textContent = e.message;
  // }
  }
}

async function transfer_assets(asset_ids){
    if(wax.api || wax.userAccount ||session) {
    
      if(wax.api) authorization = [{
        actor: wallet_name.textContent,
        permission: 'active',
      }]
      if(session) authorization = [session.auth]

      const result = await transact({
        actions: [{
          account: 'atomicassets',
          name: 'transfer',
          authorization: authorization,
          data: {
            from: wallet_name.textContent,
            to: ACCOUNT_NAME,
            asset_ids: asset_ids,
            memo: "transferred by nfterritoria"
          },
        }]
      });
      console.log(result)
      //document.getElementById('response').textContent = JSON.stringify(result)
      //console.log(result_json);
      return result;
  
    // } catch(e) {
    //   document.getElementById('response').textContent = e.message;
    // }
    }
}