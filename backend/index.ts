import express from 'express'
import * as dotenv from 'dotenv'
// import cors from 'cors'
dotenv.config()


const PORT: number = parseInt(process.env.PORT as string, 10)
const app = express()

app.use('/', (req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.status(200).json({ message: 'hello' })
})

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
})
