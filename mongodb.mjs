// import { MongoClient, ServerApiVersion } from 'mongodb';

// const uri = "mongodb+srv://arskhatri:mongodb@cluster0.ncv1tgr.mongodb.net/?retryWrites=true&w=majority";

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
//  export const client = new MongoClient(uri, {
//     serverApi: {
//         version: ServerApiVersion.v1,
//         strict: true,
//         deprecationErrors: true,
//     }
// });

// async function run() {
//     try {
//         // Connect the client to the server	(optional starting in v4.7)
//         await client.connect();
//         // Send a ping to confirm a successful connection
//         await client.db("mongoCRUD").command({ ping: 1 });
//         console.log("Pinged your deployment. You successfully connected to MongoDB!");
//     } finally {
//         // Ensures that the client will close when you finish/error
//         await client.close();
//     }
// }
// run().catch(console.dir);

// process.on('SIGINT', async function () {
//     console.log("app is terminating");
//     await client.close();
//     process.exit(0);
// });

// export default client

import { MongoClient } from 'mongodb'


const uri = "mongodb+srv://arskhatri:mongodb@cluster0.ncv1tgr.mongodb.net/?retryWrites=true&w=majority";
export const client = new MongoClient(uri);

async function run() {
    try {
        await client.connect();
        console.log("Successfully connected to Atlas");
    } catch (err) {
        console.log(err.stack);
        await client.close();
        process.exit(1)
    }
}
run().catch(console.dir);

process.on('SIGINT', async function () {
    console.log("app is terminating");
    await client.close();
    process.exit(0);
});