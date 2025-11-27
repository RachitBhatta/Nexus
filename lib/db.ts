import {MongoClient,Db,MongoClientOptions} from 'mongodb';

const mongodb_url=process.env.MONGODB_URL;
if(!mongodb_url){
    throw new Error("Please Add MONGODB URL to .env file");
}

const options:MongoClientOptions={
    //Optimised Pool Size
    maxPoolSize:1,
    minPoolSize:0,

    //For critical timeout due to cold starts
    serverSelectionTimeoutMS:5000,
    socketTimeoutMS:45000,
    connectTimeoutMS:10000,

    //Retry Config
    retryReads:true,
    retryWrites:true,

    //Compression reduces bandwidth costs
    compressors:['zlib','snappy'],

    //Connection monitory checks if connection is working each 10 second
    heartbeatFrequencyMS:10000,
};
/*
    Catching is very powerful feature in next js hepling to reduce server cost and sloves a big fault in next js that is it make 
    a new connection when user calls database eventually overloading it .
    We are using global variable for catching so server can reuse the previous connection.
 */
declare global{
    var _mongoClient:MongoClient| undefined;
    var _mongoPromise:Promise<MongoClient>| undefined;
}

let cachedClient:MongoClient|null=null;
let cachedDb:Db|null=null;

const getMongoClient=async()=>{
    if(global._mongoClient){
        try {
            await global._mongoClient.db().admin().ping();
            return global._mongoClient;
        } catch (error) {
            console.warn("Cached Client Failed Ping ,Reconnectiong ...");
            global._mongoClient=undefined;
            global._mongoPromise=undefined;
        }
    }
    //Create or reuse connection promise
    if(!global._mongoPromise){
        const client=new MongoClient(mongodb_url,options);
        global._mongoPromise=client.connect();
    }
    try {
        global._mongoClient=await global._mongoPromise;
        return global._mongoClient;
    } catch (error) {
        global._mongoPromise=undefined;
        throw error;
    }
}

export async function connectDB(dbName?:string): Promise<Db>{
    try {
        const client = await getMongoClient();
        
        const targetDbName=dbName|| extractDbNameFromUrl(mongodb_url);

        if(!targetDbName){
            throw new Error("Database name not found in URL or parameters")
        }
        if(!cachedDb || cachedDb!==)
    } catch (error) {
        
    }
}