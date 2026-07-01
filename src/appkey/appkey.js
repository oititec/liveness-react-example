import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { facecaptchaService } from '../backend/facecaptcha-service';
import ImgDados from "../assets/img/img-certiface-dados.jpg";
import './appkey.css'

const AppKey = () => {

  const navigate = useNavigate();

  const [cpf, setCpf] = useState('');
  const [nome, setNome] = useState('');
  const [nascimento, setNascimento] = useState('');
  const [status, setStatus] = useState('');

  const onCpfInput = (e) => {
    let value = e.target.value.replace(/\D/g, '');

    if (value.length > 11) {
      value = value.substring(0, 11);
    }

    value = value.replace(/^(\d{3})(\d)/, '$1.$2');
    value = value.replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
    value = value.replace(/\.(\d{3})(\d)/, '.$1-$2');

    setCpf(value);
  };

  const onDataNascimentoInput = (e) => {
    let value = e.target.value.replace(/\D/g, '');

    if (value.length > 8) {
      value = value.substring(0, 8);
    }

    if (value.length > 2) {
      value = value.replace(/^(\d{2})(\d)/, '$1/$2');
    }

    if (value.length > 5) {
      value = value.replace(
        /^(\d{2})\/(\d{2})(\d)/,
        '$1/$2/$3'
      );
    }

    setNascimento(value);
  };
  const dataValida =
    nascimento === '' ||
    /^\d{2}\/\d{2}\/\d{4}$/.test(nascimento);

  const formularioValido =
    cpf.trim().length > 0 &&
    nome.trim().length > 0 &&
    /^.+\s+.+$/.test(nome) &&
    dataValida;

  const enviar = async (e) => {
    e.preventDefault();

    try {
      const cpfSemMascara = cpf.replace(/\D/g, '')
      const response =
        await facecaptchaService.gerarAppkey(
          cpf.replace(/\D/g, ''),
          nome,
          nascimento
        );

      localStorage.setItem('cpf', cpfSemMascara);
      localStorage.setItem('nome', nome);
      localStorage.setItem('nascimento', nascimento);
      localStorage.setItem('appkey', response.data.appkey);

      navigate('/home');
    } catch (error) {
      setStatus('Dados inválidos!');
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
              Agora gere uma AppKey informando seus dados.
            </p>

            {status && (
              <div className="mb-3">
                <span style={{ color: "red" }}>
                  <strong>{status}</strong>
                </span>
              </div>
            )}

            <div className="mb-3">
              <label>
                <strong>CPF</strong>
              </label>

              <input
                className="form-control"
                placeholder="Informe o CPF"
                value={cpf}
                onChange={onCpfInput}
              />
            </div>

            <div className="mb-3">
              <label>
                <strong>Nome</strong>
              </label>

              <input
                className="form-control"
                placeholder="Informe o nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label>
                <strong>Data de nascimento</strong>
              </label>

              <input
                className="form-control"
                placeholder="Informe a data de nascimento"
                value={nascimento}
                onChange={onDataNascimentoInput}
              />
            </div>

            <button
              className="btn btn-success btn-rounded me-4 w-100"
              disabled={!formularioValido}
              onClick={enviar}
            >
              <strong>Gerar AppKey</strong>
            </button>

          </div>
        </div>

        <div className="col-md-6 d-none d-md-flex pt-3 ps-0 pe-0 pb-0">
          <img
            src={ImgDados}
            alt="Login"
            className="img-login"
          />
        </div>

      </div>
    </div>
  );
};

export default AppKey;
