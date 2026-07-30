import { useNavigate } from 'react-router-dom';
import md5 from 'crypto-js/md5';
import { facecaptchaService } from '../backend/facecaptcha-service';
import React from 'react';
import ImgLogin from "../assets/img/img-certiface-login.jpg";
import { useState } from 'react';
import './login.css';

const Login = () => {
    const navigate = useNavigate();

    const [login, setLogin] = useState('');
    const [senha, setSenha] = useState('');
    const [status, setStatus] = useState('');

    const formularioValido =
        login.trim().length > 0 &&
        senha.trim().length > 0;

    const enviar = async (e) => {
        e.preventDefault();

        try {
            const response = await facecaptchaService.credential(
                login,
                md5(senha).toString()
            );

            localStorage.setItem('login', login);
            localStorage.setItem('senhaMd5', md5(senha));
            localStorage.setItem('credentialResponse',JSON.stringify(response.data));

            navigate('/appkey');
        } catch (error) {
            setStatus('Login ou senha incorretos!');
            console.error('Erro ao enviar', error);
        }
    };

    return (
        <div className="container-fluid content-screen">
            <div className="row g-0 h-100">
                <div className="col-md-6 d-flex justify-content-center">
                    <div className="content-area">

                        <h1>
                            <strong>CertiFace Sample Web</strong>
                        </h1>

                        <p className="sub-title">
                            Acesse nossas demonstrações com seu login e senha.
                        </p>

                        <form className="form-horizontal" onSubmit={enviar}>

                            <div className="mb-3">
                                {status && (
                                    <span
                                        className="align-self-center"
                                        style={{ color: 'red' }}
                                    >
                                        <strong>{status}</strong>
                                    </span>
                                )}
                            </div>

                            <div className="mb-3">
                                <label>
                                    <strong>Login</strong>
                                </label>

                                <input
                                    className="form-control"
                                    placeholder="Informe seu login"
                                    value={login}
                                    onChange={(e) => setLogin(e.target.value)}
                                />
                            </div>

                            <div className="mb-3">
                                <label>
                                    <strong>Senha</strong>
                                </label>

                                <input
                                    type="password"
                                    className="form-control"
                                    placeholder="Informe sua senha"
                                    value={senha}
                                    onChange={(e) => setSenha(e.target.value)}
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn btn-success btn-rounded me-4 w-100"
                                disabled={!formularioValido}
                            >
                                <strong>Entrar</strong>
                            </button>

                        </form>
                    </div>
                </div>

                <div className="col-md-6 d-none d-md-flex pt-3 ps-0 pe-0 pb-0">
                    <img
                        src={ImgLogin}
                        className="img-login"
                        alt="Login"
                    />
                </div>
            </div>
        </div>
    );
};

export default Login;