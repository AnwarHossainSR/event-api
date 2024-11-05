import { cleanEnv, port, str } from 'envalid';

function validateEnv(): void {
    cleanEnv(process.env, {
        NODE_ENV: str({
            choices: ['development', 'production'],
        }),
        PORT: port({ default: 3000 }),
        JWT_SECRET: str({ default: 'secret' }),
    });
}

export default validateEnv;
