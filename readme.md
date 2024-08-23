
 
# Projeto de  Sebo E-commerce com Microserviços

Este projeto é um exemplo de arquitetura de e-commerce implementado utilizando o conceito de microserviços. O objetivo é demonstrar a separação de responsabilidades entre diferentes serviços que compõem a aplicação, como autenticação, gerenciamento de produtos e gateway de API.

## Estrutura do Projeto

A estrutura do projeto é dividida em três partes principais:

1. **Frontend**: Responsável pela interface do usuário, onde as requisições são enviadas ao `API Gateway` para serem encaminhadas aos microserviços apropriados.
   
2. **API Gateway**: Age como intermediário entre o frontend e os microserviços, redirecionando as requisições de acordo com o endpoint solicitado.
   
3. **Microserviços**:
    - **backend-auth**: Gerencia as funcionalidades de autenticação e registro de usuários.
    - **backend-produtos**: Responsável pelo gerenciamento de produtos, incluindo operações de CRUD (Create, Read, Update, Delete).

## Endpoints dos Microserviços

### API Gateway
- Porta: `8000`
- Base URL: `http://localhost:8000`
- Encaminha requisições para os microserviços apropriados com base no endpoint.

### backend-auth
- Porta: `1000`
- Base URL: `http://localhost:1000`
- Responsável pela autenticação e registro de usuários.
- Endpoints:
  - `/auth/register`
  - `/auth/login`

### backend-produtos (esse serviço pode ser dividio em dois)
- Porta: `2000`
- Base URL: `http://localhost:2000`
- Gerencia o catálogo de produtos e operações relacionadas.
- Endpoints:
  - `/products`
  - `/purchased-products`
  - `/checkout`
  - `/admin/reservations`
  - `/admin/update-status`
  - `/admin/remove-reservation`
  - `/admin/sales`

## Configuração do Projeto

### Configuração do Frontend

No frontend, o arquivo de configuração `config.js` está localizado em `frontend/js/componentes/utils/config.js`. Ele define a base URL para a API Gateway:

```javascript
const config = {
    baseURL: 'http://localhost:8000'
};

export default config;

```
## Execução Local
Para rodar a aplicação localmente, cada microserviço deve ser executado em uma porta diferente, como especificado acima. 
- O API Gateway deve rodar na porta 8000.
- Frontend na porta 5500.
- O backend-auth na porta 1000.
- O backend-produtos na porta 2000.

Caso suba para produção cada serviço deve ficar em um domínio ou subdominio diferentes, ex: meusite.com enviando para api.meusite.com onde se conecta com auth.meusite.com e produtos.meusite.com, e também alterar as politicas de cors de cada serviço.

## O que são Microserviços?
Microserviços são uma abordagem de arquitetura de software que se baseia na divisão de uma aplicação em um conjunto de serviços pequenos, cada um executando uma função específica e comunicando-se entre si por meio de APIs. Cada microserviço é autônomo e pode ser desenvolvido, implantado e escalado de forma independente, no caso desse projeto o serviço produtos ainda pode ser separado mais para as buscas dos frontend publico e as buscas e atualizações do frontend administrativo.

## Vantagens dos Microserviços
- Escalabilidade: Cada microserviço pode ser escalado independentemente, de acordo com suas necessidades específicas.

- Desenvolvimento Independente: Diferentes equipes podem trabalhar em diferentes microserviços sem interferir umas nas outras.

- Resiliência: Falhas em um microserviço não afetam diretamente os outros serviços, aumentando a resiliência da aplicação como um todo.

- Desempenho Otimizado: Cada microserviço pode ser otimizado e configurado de acordo com suas necessidades específicas, melhorando o desempenho geral da aplicação.

- Flexibilidade Tecnológica: Cada microserviço pode ser desenvolvido usando diferentes linguagens de programação ou tecnologias, conforme a melhor adequação à sua função específica.

Este projeto demonstra uma implementação simples de um sistema de "e-commerce" usando a arquitetura de microserviços. Embora o sistema esteja em um ambiente de desenvolvimento local, a estrutura é configurada para fácil escalabilidade e adaptação em ambientes de produção. Este exemplo serve como um ponto de partida para explorar mais profundamente as vantagens e desafios da arquitetura de microserviços.