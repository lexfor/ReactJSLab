import { migrate } from "postgres-migrations"
import { client } from "./DBconnection";

async function migrations() {
    await client.connect()
    try {
        await migrate({client}, "./migrations")
    } finally {
        await client.end()
    }
}

migrations();