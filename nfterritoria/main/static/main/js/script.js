const wax = new waxjs.WaxJS(API);
var session;

// sleep time expects milliseconds
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function login() {
  // try {
    const userAccount = await wax.login();
    const button = document.getElementById("Wax_log");
    button.disabled = true;

    const wallet_info = document.getElementById("wallet_info");
    const wallet_name = document.getElementById("wallet_name");
    wallet_name.textContent = userAccount;
    await get_whitelist();
    await get_tokens_amount();
    await get_stored_tokens();

    // Animation
    wallet_info.setAttribute("style","animation: showRight 2s;")

    //Show nfts info
    await get_nfts_info();

  // } catch(e) {
  //   console.log(e.message);
  // }
}

const identifier = 'nfterritoria'
const transport = new AnchorLinkBrowserTransport()
const link = new AnchorLink({
  transport,
  chains: [{
      chainId: '1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4',
      nodeUrl: 'https://wax.greymass.com',
  }]
})
function restoreSession() {
  link.restoreSession(identifier).then((result) => {
      session = result
      if (session) {
          didLogin()
      }
  })
}
//restoreSession()

async function anchorLogin(){
  console.log("Anchor login")
  link.login(identifier).then((result) => {
    session = result.session
    didLogin()
  })
}

function anchorLogout() {
  document.body.classList.remove('logged-in')
  session.remove()
}
async function didLogin() {
  //document.getElementById('account-name').textContent = session.auth.actor
  //document.body.classList.add('logged-in')
  const wallet_info = document.getElementById("wallet_info");
  const wallet_name = document.getElementById("wallet_name");
  wallet_name.textContent = session.auth.actor;
  console.log("get whitelist")
  await get_whitelist();
  console.log("get tokens amount")
  await get_tokens_amount();
  console.log("get stored token")
  await get_stored_tokens();

  // Animation
  wallet_info.setAttribute("style","animation: showRight 2s;")

  //Show nfts info
  await get_nfts_info();
}


async function logout(){
  // try{
    delete(wax.userAccount);
    const button = document.getElementById('logout');
    button.disabled = true;
  // } catch(e){
  //   console.log(e.message)
  // }
}

async function get_whitelist(){
   await send_data_to_ws(JSON.stringify({
    "type":"check_whitelist",
    "account":wallet_name.textContent
  }))
}

async function get_stored_tokens(){
  await send_data_to_ws(JSON.stringify({
    "type":"get_stored_tokens",
    "account":wallet_name.textContent
  }))
}

async function get_new_passphrase(){
  if(wax.api || wax.userAccount ||session) {
    let passphrase = await randomString(8);

    // proof

    if(wax.api) authorization = [{
      actor: wallet_name.textContent,
      permission: 'active',
    }]
    if(session) authorization = [session.auth]

    const passphrase_wax_actions = {
      actions: [{
        account: "eosio.token",
        name: "transfer",
        authorization: authorization,
        data: {
          from: wallet_name.textContent,
          to: ACCOUNT_NAME,
          quantity: "0.00000001 WAX",
          memo: "GetNewPassphrase"
        }
      }]
    }

    const transaction_result = transact(passphrase_wax_actions);
    const json_result = JSON.parse(transaction_result);

    if(session){
      transaction_id = json_result["id"]
    } else if(wax.api){
      transaction_id = json_result["transaction_id"]
    }

    data_for_ws = {
      "type":"register_user",
      "user_name":wallet_name.textContent,
      "phrase":passphrase,
      "transaction_id": transaction_id
    }
    await send_data_to_ws(JSON.stringify(data_for_ws))
    
    Swal.fire(
      'Your passphrase, please save it:',
      passphrase,
      'info'
    )
  }
}

async function unstake_tokens(){
  if(wax.api || wax.userAccount ||session) {
    data_for_ws = {
      "type":"unstake_tokens",
      "account": wallet_name.textContent
    }
    await send_data_to_ws(JSON.stringify(data_for_ws))
    Swal.fire(
      "Unstaking processing...",
      "Please wait.",
      "success"
    )
  }
}

async function get_nfts_info(){
  if(wax.api ||session){

    const whitelist_count = document.getElementById("whitelist_text");

    const chicken_miner_count = document.getElementById("chicken_miner_text");
    const pig_miner_count = document.getElementById("pig_miner_text");
    const cow_miner_count = document.getElementById("cow_miner_text");
    const ocelot_miner_count = document.getElementById("ocelot_miner_text");
    const redstone_miner_count = document.getElementById("redstone_miner_text");
    const furnace_miner_count = document.getElementById("furnace_miner_text");
    const founder_miner_count = document.getElementById("founder_miner_text");

    const terr_8_count = document.getElementById("terr_8_text");
    const terr_16_count = document.getElementById("terr_16_text");
    //..
    whitelist_count.textContent=(await get_assets(COLLECTION,TEMPLATE_IDS["whitelist"])).length

    chicken_miner_count.textContent=(await get_assets(COLLECTION,TEMPLATE_IDS["chicken"])).length
    pig_miner_count.textContent=(await get_assets(COLLECTION,TEMPLATE_IDS["pig"])).length
    cow_miner_count.textContent=(await get_assets(COLLECTION,TEMPLATE_IDS["cow"])).length
    ocelot_miner_count.textContent=(await get_assets(COLLECTION,TEMPLATE_IDS["ocelot"])).length
    redstone_miner_count.textContent=(await get_assets(COLLECTION,TEMPLATE_IDS["redstone"])).length
    furnace_miner_count.textContent=(await get_assets(COLLECTION,TEMPLATE_IDS["furnace"])).length
    founder_miner_count.textContent=(await get_assets(COLLECTION,TEMPLATE_IDS["founder"])).length

    terr_8_count.textContent=(await get_assets(COLLECTION,TEMPLATE_IDS["territory8"])).length
    terr_16_count.textContent=(await get_assets(COLLECTION,TEMPLATE_IDS["territory16"])).length
  }

}

async function get_tokens_amount(){
  if(wax.api ||session){
    const tokens_data = await get_tokens();
    var tokens = {
      "CKTERR":0,
      "PGTERR":0,
      "CWTERR":0,
      "OCTERR":0,
      "RSTERR":0,
      "FCTERR":0,
      "FDTERR":0,
    };
    tokens_data.forEach(element => {
      if(element["contract"]==ACCOUNT_NAME) tokens[element["symbol"]]=element["amount"];
    });
    document.getElementById("Chicken").textContent = tokens["CKTERR"];
    document.getElementById("Pig").textContent = tokens["PGTERR"];
    document.getElementById("Cow").textContent = tokens["CWTERR"];
    document.getElementById("Ocelot").textContent = tokens["OCTERR"];
    document.getElementById("Redstone").textContent = tokens["RSTERR"];
    document.getElementById("Furnace").textContent = tokens["FCTERR"];
    document.getElementById("Founder").textContent = tokens["FDTERR"];
  }
}

async function reload_data(){
  console.log("reloading data");
  await get_whitelist();
  await get_stored_tokens();
  await get_nfts_info();
  await  get_tokens_amount();
}

///////////// STAKING ////////////////

async function stake_chicken(){
  stake("chicken");
}

async function stake_pig(){
  stake("pig");
}

async function stake_cow(){
  stake("cow");
}

async function stake_ocelot(){
  stake("ocelot");
}

async function stake_redstone(){
  stake("redstone");
}

async function stake_furnace(){
  stake("furnace");
}

async function stake_founder(){
  stake("founder");
}

async function stake_whitelist(){
  stake("whitelist");
}

async function stake_territory16(){
  stake("territory16");
}

async function stake_territory8(){
  stake("territory8");
}

///////////////////////////////////////


async function stake(asset_name){
  if(wax.api || wax.userAccount ||session) {
    let transaction_id;

    const assets = await get_assets(COLLECTION,TEMPLATE_IDS[asset_name])
    const assets_for_transfer = [assets[0]]
    console.log("assets_for_transfer: " + assets_for_transfer)
    try{
      const result = await transfer_assets(assets_for_transfer)
      console.log(result)

      json_result = JSON.parse(result)
      if(session){ // if anchor
        transaction_id = json_result["id"]
      } else if(wax.api){
        transaction_id = json_result["transaction_id"]
      }
      Swal.fire(
        'Successefully transferred! Save transaction id:',
        transaction_id,
        'success'
      )
      var type = "transferred_assets";
      if(asset_name=="whitelist") type = "whitelist_user";
      else if(asset_name.includes("territory")) type = "stake_territory";

      data_for_ws = {
        "type":type,
        "asset_id":assets_for_transfer[0],
        "transaction_id":transaction_id,
        "account":wallet_name.textContent,
        "item":ITEM_NAMES[asset_name]
      }

      await send_data_to_ws(JSON.stringify(data_for_ws))
      return console.log(result);
    }catch(e){
      console.log(e)
      Swal.fire(
        "Error!",
        "Please check your Wax resources.",
        "error"
    )
    }
  }
}

///////////// CRAFTING ////////////////

async function craft_chicken(){
  craft("chicken");
}

async function craft_pig(){
  craft("pig");
}

async function craft_cow(){
  craft("cow");
}

async function craft_ocelot(){
  craft("ocelot");
}

async function craft_redstone(){
  craft("redstone");
}

async function craft_furnace(){
  craft("furnace");
}

async function craft_founder(){
  craft("founder");
}



///////////////////////////////////////


async function craft(asset_name){
  if(wax.api || wax.userAccount ||session){
    let transaction_id;
    const result = await transfer_tokens(CRAFT_REQUIREMENTS[asset_name]);
    console.log(result);
    json_result = JSON.parse(result);

    if(session){ // if anchor
      transaction_id = json_result["id"]
    } else if(wax.api){
      transaction_id = json_result["transaction_id"]
    }
    
    data_for_ws = {
      "type":"craft_asset",
      "transaction_id":transaction_id,
      "account":wallet_name.textContent,
      "asset_type":ASSET_TYPES[asset_name]
    }
    Swal.fire(
      'Successefully crafted! Save transaction id:',
      transaction_id,
      'success'
    )
    await send_data_to_ws(JSON.stringify(data_for_ws));
    return console.log(result);
  }
}

async function loop_info(){
  while(true){
    await sleep(LOOP_SLEEP);
    if(wax.api || wax.userAccount ||session) reload_data();
  }
}

//loop_info();