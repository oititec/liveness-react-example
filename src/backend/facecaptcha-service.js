import axios from 'axios';

const SERVER_API_URL = process.env.REACT_APP_BASE_URL

export const facecaptchaService = {

    async credential(login, senha) {
        const params = new URLSearchParams();

        params.append('user', login);
        params.append('pass', senha);

        return axios.post(
            `${SERVER_API_URL}/facecaptcha/service/captcha/credencial`,
            params.toString(),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );
    },

    async gerarAppkey(cpf, nome, nascimento) {
        const token = localStorage.getItem('credentialResponse');
        const login = localStorage.getItem('login');

        const params = new URLSearchParams();

        params.append('token', token || '');
        params.append('user', login || '');
        params.append('cpf', cpf);
        params.append('nome', nome);
        params.append('nascimento', nascimento);

        return axios.post(
            `${SERVER_API_URL}/facecaptcha/service/captcha/appkey`,
            params.toString(),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );
    },

    async getLivenessResult(appkey) {
        const params = new URLSearchParams();

        params.append('appkey', appkey);

        return axios.post(
            `${SERVER_API_URL}/facecaptcha/service/captcha/result`,
            params.toString(),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );
    }
};