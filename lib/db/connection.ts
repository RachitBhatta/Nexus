import {MongoClient,Db,MongoClientOptions} from 'mongodb';


const mongodb_url=process.env.MONGODB_URL;

const options:MongoClientOptions={
    //Optimised Pool Size
    maxPoolSize:10,
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
    Caching is a very powerful feature in Next.js, helping to reduce server cost and solves a big fault in Next.js: it makes 
    a new connection when the user calls the database, eventually overloading it.
    We are using a global variable for caching so the server can reuse the previous connection.
 */declare global{
    var _mongoClient:MongoClient| undefined;
    var _mongoPromise:Promise<MongoClient>| undefined;
}


let cachedDb:Db|null=null;


async function getMongoClient():Promise<MongoClient>{
    if(!mongodb_url){
    throw new Error("Please Add MONGODB URL to .env file");
    }
    if(global._mongoClient){ 
        return global._mongoClient;
    }
    //Create or reuse connection promise
    if(!global._mongoPromise){
        const client=new MongoClient(mongodb_url,options);
        const connectPromise=client.connect();
        global._mongoPromise=connectPromise;
    }
    try {
        global._mongoClient=await global._mongoPromise;
        return global._mongoClient;
    } catch (error) {
        global._mongoPromise=undefined;
        throw error;
    }
}


function extractDbNameFromUrl(connectionUrl:string):string | null{
    try {
        const url=new URL(connectionUrl);
        /*
        Removes the leading slashes and any query parameters
        For example :-
        pathname give /dbname?retrywrite(1) from https://Somesite.com/dbname?retrywrite(1)
        then substring remove the slashes dbname?retrywrite(1)
        then splits removes retrywrite and give the dbname
         */
        const dbName=url.pathname.substring(1).split("?")[0];
        return dbName||null;
    } catch (error) {
        return null
    }
}
export async function connectDB(dbName?:string): Promise<Db>{
    if(!mongodb_url){
    throw new Error("Please Add MONGODB URL to .env file");
    }
    try {
        const client = await getMongoClient();
        
        const targetDbName=dbName|| extractDbNameFromUrl(mongodb_url);

        if(!targetDbName){
            throw new Error("Database name not found in URL or parameters")
        }
        if(!cachedDb || cachedDb.databaseName!==targetDbName){
            cachedDb=client.db(targetDbName)
        }
        return cachedDb
    } catch (error) {
        throw new Error(`Failed to connect to database : ${error}`)
    }
}



//To get know if database is working or not 
export async function healthCheckStatus():Promise<boolean>{
    try {
        const client = await getMongoClient();
        // .admin and .ping are used to know whether the database is alive or to pervent any error during api request 
        await client.db().admin().ping();
        return true;
    } catch (error) {
        console.log("MongoDb health Check Failed",error);
        return false;
    }
}



//Use to get connection stats for monitoring
export async function getConnectionStatus(){
    try {
        const client=await getMongoClient();
        const serverStatus=await client.db().admin().serverStatus();
        return {
            connected:true,
            uptime:serverStatus.connections?.uptime||0,
            activeConnection:serverStatus.connections?.current||0,
            availableConnection:serverStatus.connections?.available||0
    
        }
    } catch (error) {
        return{
            connected:false,
            error:error instanceof Error?error.message:"Unknown Error"
        };
    }
}



//Close connection is going to be used in extreme situation for graceful shutdown
export async function closeConnection():Promise<void>{
    try {
        if(global._mongoClient){
            await global._mongoClient.close();
            global._mongoClient=undefined;
            global._mongoPromise=undefined;
            cachedDb=null;
            console.log("Connection Close SuccessFully")
        }
    } catch (error) {
        console.log("Error in closing connection",error);
    }
}
