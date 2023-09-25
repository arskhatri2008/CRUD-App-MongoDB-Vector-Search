// import express from 'express'
// // import { client } from "../mongodb.mjs";
// let router = express.Router()
// // import { nanoid } from 'nanoid';

// let db = client.db('mongoCRUD')

// // let posts = [{
//     //     id: nanoid(),
//     //     title: "title of the post",
//     //     text: "text of the post"
//     // }]

//     router.post('/post', async (req, res, next) => {
//         // console.log(res.send)
//         if (!req.body.title || !req.body.text) {
//             res.status(403)
//             res.send("Error! required fields are missing.")
//             return
//         }
//         await db.collection('posts').insertOne({
//             // id: nanoid(),
//             title: req.body.title,
//             text: req.body.text
//         });
//         res.send('post created.')
//     })


//     router.get('/posts', (req, res, next) => {
//         const posts = db.collection('posts').find({}).toArray();
//         res.send(posts)
//     })

//     export default router




import express from 'express';
import { nanoid } from 'nanoid'
import { client } from './../mongodb.mjs'
import {ObjectId} from 'mongodb'

const db = client.db("cruddb");
const col = db.collection("posts");

let router = express.Router()

// not recommended at all - server should be stateless
// let posts = [
//     {
//         id: nanoid(),
//         title: "abc post title",
//         text: "some post text"
//     }
// ]

// POST    /api/v1/post
router.post('/post', async (req, res, next) => {
    // console.log('this is signup!', new Date());
    try {
        if (
            !req.body.title || !req.body.text
        ) {
            res.status(403);
            res.send(`required parameters missing, 
            example request body:
            {
                title: "abc post title",
                text: "some post text"
            } `);
            return;
        }
        const insertResponse = await col.insertOne({
            // id: nanoid(),
            title: req.body.title,
            text: req.body.text,
            date: new Date()
        
        });
        console.log("insertResponse: ", insertResponse);
    
        res.send({message:'post created'});
    }
    catch (error) {
      console.log(error);
      res.send({message:'Error occurred.'})  
    }})



router.get('/posts', async (req, res, next) => {

    const cursor = col.find({}).sort({_id:-1});
    let results = await cursor.toArray()
    console.log("results: ", results);
    res.send(results);
})




// router.get('/post/:postId', (req, res, next) => {
//     console.log('this is signup!', new Date());

//     if (req.params.postId) {
//         res.status(403).send(`post id must be a valid number, no alphabet is allowed in post id`)
//     }

//     for (let i = 0; i < posts.length; i++) {
//         if (posts[i].id === req.params.postId) {
//             res.send(posts[i]);
//             return;
//         }
//     }
//     res.send('post not found with id ' + req.params.postId);
// })

// PUT     /api/v1/post/:userId/:postId
// {
//     title: "updated title",
//     text: "updated text"
// }

router.put('/post/:postId', async (req, res, next) => {

    if (!req.params.postId || !req.body.text || !req.body.title) {
        res.status(403).send(`example put body: 
        PUT     /api/v1/post/:postId
        {
            title: "updated title",
            text: "updated text"
        }
        `);
        return;
    }

    // const cursor = col.find[{_id: new ObjectId(req.params.postId._id)}]

    try {
        await col.updateOne(
            { _id: new ObjectId(req.params.postId) },
            {
              $set: { title: req.body.title , text: req.body.text },
            //   $currentDate: { lastModified: true }
            }
          );
          res.send({message: 'Data has been updated.'});
        
    } catch (error) {
        console.log(error);
        res.send("Error occurred")
        
    }


    // for (let i = 0; i < col.length; i++) {
    //     if (col[i].id === req.params.postId) {
    //         col[i] = {
    //             text: req.body.text,
    //             title: req.body.title,
    //         }
    //         res.send('post updated with id ' + req.params.postId);
    //         return;
    //     }
    // }
    // res.send('post not found with id ' + req.params.postId);
});

// DELETE  /api/v1/post/:userId/:postId
router.delete('/post/:postId', async (req, res, next) => {

    if (!req.params.postId) {
        res.status(403).send({message: `post id must be a valid id`})
    }
    try{
    await col.deleteOne({ _id: new ObjectId(req.params.postId) });
    res.send({message: 'Data has been deleted.'})
    }catch (err){

    res.status(404).send({message: 'Error deleting.'})
    
    }

    // for (let i = 0; i < posts.length; i++) {
    //     if (posts[i].id === req.params.postId) {
    //         posts.splice(i, 1)
    //         res.send('post deleted with id ' + req.params.postId);
    //         return;
    //     }
    // }
    // res.send('post not found with id ' + req.params.postId);
})

export default router