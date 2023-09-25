import express from 'express'
import path from 'path'
import postRouter from './routes/posts.mjs'
const __dirname = path.resolve()
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/v1/mongoDB', postRouter)


app.use(express.static(path.join(__dirname,'public')))

const PORT = process.env.PORT || 5001
app.listen(PORT,()=>{
    console.log(`Example app listening on port ${PORT}`)
})
