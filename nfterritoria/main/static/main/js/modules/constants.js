const ACCOUNT_NAME = "nfterritoria";
const TOKENS_ACCOUNT_NAME = "nfterritoria";
const API = "https://wax.eu.eosamsterdam.net"; //const API = "https://wax.greymass.com";
const tAPI = "https://wax.eu.eosamsterdam.net" // Api for get_tokens()
const WEBSOCKET = "wss://nfterritoria.com/websocket";

const LOOP_SLEEP = 30000; //ms
const TRANSACTION_WAIT_TIME = 240; //s

const COLLECTION = "nfterritoria";

const TEMPLATE_IDS = {
    "chicken":292558,
    "pig":292560,
    "cow":292559,
    "ocelot":292561,
    "redstone":292563,
    "furnace":292562,
    "founder":292564,

    "whitelist":292557,
    "territory16":292567,
    "territory8":292566
}

const ITEM_NAMES = {
    "chicken":"nft:chicken",
    "pig":"nft:pig",
    "cow":"nft:cow",
    "ocelot":"nft:ocelot",
    "redstone":"nft:redstone",
    "furnace":"nft:furnace",
    "founder":"nft:founder",

    "whitelist":"WHITELIST",
    "territory16":"16",
    "territory8":"8"
}

const CRAFT_REQUIREMENTS = {
    "chicken":"540.0000 CKTERR",
    "pig":"720.0000 PGTERR",
    "cow":"1080.0000 CWTERR",
    "ocelot":"1440.0000 OCTERR",
    "redstone":"1800.0000 RSTERR",
    "furnace":"1512.0000 FCTERR",
    "founder":"1728.0000 FDTERR"
}

const ASSET_TYPES = { // xD
    "chicken":"chicken",
    "pig":"pig",
    "cow":"cow",
    "ocelot":"ocelot",
    "redstone":"redstone",
    "furnace":"furnace",
    "founder":"founder"
}
