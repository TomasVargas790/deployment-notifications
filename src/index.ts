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
server.post('/pr', async (req, res) => {
    console.log(req);
    //await checkDeployment(id)
    res.send()
})


server.listen(port, () => console.log(`SERVER RUNNING ON ${port}`))

async function checkDeployment(deployId: string) {
    let completed = false
    console.log('completed', completed);


    while (!completed) {

        const deployResult = await SFConection.metadata.checkDeployStatus(deployId, true);
        console.clear();


        console.log(`Estado: ${deployResult.status}`);
        console.log(`Progreso: ${deployResult.numberComponentsDeployed}/${deployResult.numberComponentsTotal}`);
        console.log(`tests: ${deployResult.numberTestsCompleted}/${deployResult.numberTestsTotal}`);
        //console.table(deployResult.details.componentSuccesses || []);

        if (deployResult.done) {
            completed = true;
            if (deployResult.success) {
                console.log('El despliegue se completó con éxito.');
            } else {
                console.error('El despliegue falló.');
                console.error('Errores:', deployResult.details.componentFailures || []);
            }
            const text = `
    Deployment Status ${deployId}
    Estado: ${deployResult.status}
    Progreso: ${deployResult.numberComponentsDeployed}/${deployResult.numberComponentsTotal}
    tests: ${deployResult.numberTestsCompleted}/${deployResult.numberTestsTotal}`

            slackConection.chat.postMessage({
                channel: 'C088GTX1B9S',
                text
            })
            //SFConection.request('/services/data/v62.0/actions/custom/flow/', { input: [{ deployId, user: deployResult.createdByName }] })

        } else {
            await new Promise((resolve) => setTimeout(resolve, 5000));
        }

    }
}