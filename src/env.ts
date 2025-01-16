type APIConfig = {
    port: string,
    env: string,
    slack_token: string,
};

type SFConfig = {
    token: string,
    instanceUrl: string,
    user: string,
    pass: string
}

type EnvType = {
    api: APIConfig
    sf: SFConfig
};

const validateEnvVariables = (envVariables: string[]): void => {
    envVariables.forEach((variable) => {
        if (!process.env[variable]) {
            console.error(`Error: ${variable} is missing in the environment.`);
            process.exit(1);
        }
    });
};

const requiredEnvVariables = ["PORT", "ENVIRONMENT"];
validateEnvVariables(requiredEnvVariables);

const { PORT,
    ENVIRONMENT,
    SF_TOKEN,
    SF_USER,
    SF_PASS,
    SLACK_TOKEN,
    SF_INSTANCE_URL } = process.env;


const apiConfig: APIConfig = {
    port: PORT as string,
    env: ENVIRONMENT as string,
    slack_token: SLACK_TOKEN as string,
};

const sfConfig: SFConfig = {
    token: SF_TOKEN as string,
    user: SF_USER as string,
    pass: SF_PASS as string,
    instanceUrl: SF_INSTANCE_URL as string
}

export const env: EnvType = {
    api: apiConfig,
    sf: sfConfig
};