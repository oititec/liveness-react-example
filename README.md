# CertiFace para React

Este repositório contém o processo de liveness em 2D, 3D, envio de documentos e guia rápido de atualização.

Para visualizar a documentação de cada módulo, utilize os links abaixo:

- [Visão geral](https://github.com/oititec/liveness-react-example/blob/feat/REAME.md-update/src/home/README.md)
- [Liveness 2D](https://github.com/oititec/liveness-react-example/blob/feat/REAME.md-update/src/liveness-2d/README.md)
- [Liveness 3D](https://github.com/oititec/liveness-react-example/blob/feat/REAME.md-update/src/liveness-3d/README.md)
- [Envio de documentos](https://github.com/oititec/liveness-react-example/blob/feat/REAME.md-update/src/send-documents/README.md)

---

## Changelog Liveness 3D

# Versão do SDK da FaceTec em produção:

9.6.30 atualizado em 16/05/2023

---

## Abaixo estão os procedimentos para atualização do SDK da FaceTec para os exemplos de implementação desenvolvidos internamente pela Oiti

<br>

**1. Download do SDK**
<br>
Acesse o site [https://dev.facetec.com/](https://dev.facetec.com/) e no menu lateral, clique em **Download SDKs** conforme print abaixo:
![Captura de tela de 2023-04-03 12-26-12.png](https://i.ibb.co/X5RWYbD/image.png)
<br>
<br>
**2. Faça login usando seu e-mail da Oiti**
![Captura de tela de 2023-04-03 12-28-10.png](https://i.ibb.co/BZDwSt8/image.png)
Você receberá um e-mail com instruções para efetuar o login.

**3. Clique novamente em Download SDKs no menu da lateral após efetuar o login para ser direcionado para a tela de download**
![Captura de tela de 2023-04-03 12-33-33.png](https://i.ibb.co/RN3Gkm4/image.png)

**4. Clique em Browser e em seguida, clique em "No, just download the SDK without configuration"**
![Captura de tela de 2023-04-03 12-34-32.png](https://i.ibb.co/cYH7HXz/image.png)

**5. Após o download, descompacte o conteúdo do arquivo ZIP e em seguida você deverá copiar os diretórios `core-sdk` e `core-sdk-optional`**
![Captura de tela de 2023-04-03 12-37-10.png](https://i.ibb.co/mvSZv95/image.png)
Esses dois diretórios contém os arquivos do SDK e a tradução oficial que deixará as mensagens em português durante o uso.

---

### Para atualizar o SDK no exemplo em `React`:

Dentro do projeto de exemplo em `React`, localize o diretório `core-sdk` no diretório raíz do projeto

Agora é só colar os arquivos e pronto. SDK atualizado com sucesso.

Localize o diretório `core-sdk-optional` no seguinte caminho:
<br>
`core/`

Agora é só colar os arquivos e pronto. Os arquivos de tradução foram atualizados com sucesso.

### FaceTec SDK: 9.6.30

_data: 16/05/2023_

- Added New Device-side and Server-side Video Injection Checks to mitigate Generative AI Threats.
- Performance improvements on low-tier and mid-tier devices leading to Success Rate Improvements.
- Fixes for multiple issues affecting usability when integrated into a iFrame-based Applications.
- Various stability improvement fixes.
- Improvements to Blind User Assistance Mode.

### FaceTec SDK: 9.6.26

_data: 17/04/2023_

### FaceTec SDK: 9.6.24

_data: 31/03/2023_

### FaceTec SDK: 9.6.21

_data: 09/03/2023_

- Added significant new Device and Server SDK AI layers to protect against sophisticated Level 5 Attacks.
- Numerous Compatibility, Stability, and Performance Improvements.
- Update I'm Ready Screen timer that auto-sends Users into the Face Scan UI in Blind User Assist Mode to 30 seconds to give visually impaired Users more time to prepare for the Face Scan.
