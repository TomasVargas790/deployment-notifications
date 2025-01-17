import slackConection from './slack.ts'
import SFConection from './sf.ts'
import { env } from './env.ts';
import express, { json } from 'express'
import cors from 'cors'

const { api: { env: environment, port } } = env


console.clear()

const server = express()
server.use(cors())
server.use(json())
server.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded data

server.use('/', ({ url, method, body }, _, next) => {
    if (environment === 'dev') {
        console.table({ url, method, body: String(JSON.stringify(body) ?? '').slice(0, 25) })
    }
    next()
})

server.post('/', async ({ body }, res) => {
    const { type, challenge, event: { text } } = body

    if (type === 'url_verification' && !!challenge) {
        res.json({ challenge })
    }

})

server.post('/pr', async ({ body: { text: id } }, res) => {
    try {
        res.send()
        await checkDeployment(id)
    } catch (error) {
        console.error(error);

    }
})


server.listen(port, async () => {
    console.log(`SERVER RUNNING ON ${port}`)
    try {
        const connection = await SFConection.identity();
        console.log(`SF connection: ${connection.id != undefined ? 'OK' : 'FAILED'}`);
    } catch (ex) {
        console.error(`Error connecting to Salesforce, check .env file`);
        console.error(ex);
        process.exit(1);
    }
    try {
        const connection = await slackConection.api.test()
        console.log(`SLACK connection: ${connection.ok ? 'OK' : 'FAILED'}`);
    } catch (ex) {
        console.error(`Error connecting to Slack, check.env file`);
        console.error(ex);
        process.exit(1);
    }
})

async function checkDeployment(deployId: string) {
    let completed = false
    let isFirstTime = true
    console.log('completed', completed);

    while (!completed) {

        const deployResult = await SFConection.metadata.checkDeployStatus(deployId, true);
        console.clear();


        console.log(`Estado: ${deployResult.status} `);
        console.log(`Progreso: ${deployResult.numberComponentsDeployed}/${deployResult.numberComponentsTotal}`);
        console.log(`tests: ${deployResult.numberTestsCompleted}/${deployResult.numberTestsTotal}`);
        //console.table(deployResult.details.componentSuccesses || []);
        const text = `
        Deployment Status ${deployId}
        Estado: ${deployResult.status}
        Progreso: ${deployResult.numberComponentsDeployed}/${deployResult.numberComponentsTotal}
        tests: ${deployResult.numberTestsCompleted}/${deployResult.numberTestsTotal}`

        if (deployResult.done) {
            completed = true;
            if (deployResult.success) {
                console.log('El despliegue se completó con éxito.');
            } else {
                console.error('El despliegue falló.');
                console.error('Errores:', deployResult.details.componentFailures || []);
            }

            slackConection.chat.postMessage({
                channel: 'C088LKXA5NK',
                text
            })

        } else {
            if (isFirstTime) {
                slackConection.chat.postMessage({
                    channel: 'C088LKXA5NK',
                    text: `Validando...
                    ${text}`
                })
                isFirstTime = false
            }
            await new Promise((resolve) => setTimeout(resolve, 5000));
        }

    }
}

