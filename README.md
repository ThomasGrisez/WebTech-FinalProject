# Chat application - final project

_presentation, introduction, ..._

## Usage

_how to start and use the application, run the tests, ..._

- Clone this repository, from your local machine:
  ```
  git clone https://github.com/adaltas/ece-2020-fall-webtech-project.git webtech
  cd webtech
  ```
- Install [Go](https://golang.org/) and [Dex](https://dexidp.io/docs/getting-started/). For example, on Ubuntu, from your project root directory:
  ```
  # Install Go
  apt install golang-go
  # Download Dex
  git clone https://github.com/dexidp/dex.git
  # Build Dex
  cd dex
  make
  make examples
  ```
  Note, the provided `.gitignore` file ignore the `dex` folder.
- Register your GitHub application, get the clientID and clientSecret from GitHub and report them to your Dex configuration. Modify the provided `./dex-config/config.yml` configuration to look like:
  ```yaml
  - type: github
    id: github
    name: GitHub
    config:
      clientID: xxxx98f1c26493dbxxxx
      clientSecret: xxxxxxxxx80e139441b637796b128d8xxxxxxxxx
      redirectURI: http://127.0.0.1:5556/dex/callback
  ```
- Inside `./dex-config/config.yml`, the frond-end application is already registered and CORS is activated. Now that Dex is built and configured, your can start the Dex server:
  ```yaml
  cd dex
  bin/dex serve dex-config/config.yaml
  ```
- Start the back-end
  ```bash
  cd back-end
  # Install dependencies (use yarn or npm)
  yarn install
  # Optional, fill the database with initial data
  bin/init
  # Start the back-end
  bin/start
  ```
- Start the front-end
  ```bash
  cd front-end
  # Install dependencies (use yarn or npm)
  yarn install
  # Start the front-end
  yarn start
  ```

## Author

Thomas Grisez, thomas.grisez@edu.ece.fr

## Tasks

Project management

- Naming convention  
  _place your graduation and comments_
- Project structure  
  _place your graduation and comments_
- Code quality  
  _place your graduation and comments_
- Design, UX  
  _place your graduation and comments_
- Git and DevOps  
  _place your graduation and comments_

Application development

- Welcome screens  
  _place your graduation and comments_
- New channel creation  
  _place your graduation and comments_
- Channel membership and access  
  _place your graduation and comments_
- Ressource access control  
  _place your graduation and comments_
- Invite users to channels  
  _place your graduation and comments_
- Message modification  
  _place your graduation and comments_
- Message removal  
  _place your graduation and comments_
- Account settings  
  _place your graduation and comments_
- Gravatar integration  
  _place your graduation and comments_
- Avatar selection  
  _place your graduation and comments_
- Personal custom avatar  
  _place your graduation and comments_

## Bonus

_place your graduation and comments_
