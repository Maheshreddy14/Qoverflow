import mongoose from 'mongoose'


let isconnected:boolean=false

export const connectToDB=async () => {
    mongoose.set('strictQuery',true)
    const mongourl=process.env.MONGO_DB_URL || 'your_default_connection_string'
    if(!process.env.MONGO_DB_URL){
        console.log('enter valid mongodb url')
    }

    if(isconnected){
        console.log('mongodb connected')
    }

    try {
        await mongoose.connect(mongourl,{
            dbName:'qflow'
        })
        isconnected=true
        console.log('mongodb connected')

    } catch (error) {
        console.log(error)
    }
}