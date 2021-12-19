# Chat application - final project

Chat Application using React JS, made by Thomas Grisez (ECE Paris, ING4 Group 4)

## Usage

How to start and use the application, run the tests, ...\_

- Clone this repository, from your local machine:
  ```
  git clone https://github.com/adaltas/ece-2020-fall-webtech-project.git webtech
  cd webtech
  ```
- Install [Go](https://golang.org/). For example, on Ubuntu, from your project root directory:
  ```
  # Install Go
  apt install golang-go
  ```
  Note, the provided `.gitignore` file ignore the `dex` folder.
- Register your GitHub application, get the clientID and clientSecret from GitHub and report them to your Dex configuration. Modify the provided `./dex/config.yml` configuration to look like:
  ```yaml
  - type: github
    id: github
    name: GitHub
    config:
      clientID: xxxx98f1c26493dbxxxx
      clientSecret: xxxxxxxxx80e139441b637796b128d8xxxxxxxxx
      redirectURI: http://127.0.0.1:5556/dex/callback
  ```
- Inside `./dex/config.yml`, the frond-end application is already registered and CORS is activated. Now that Dex is built and configured, your can start Dex:
  ```bash
  docker-compose up
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
- Start the front-end, it will accessible on http://localhost:3000.  
  **BE CAREFUL** If you are logging in for the first, sometimes a bug will occur and il will display "loading tokens", in this case you need to delete everything in the url after http://127.0.0.1:3000/ and redo the login process and it will work.

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
  I used PascalCase for components and all front-end files, camelCase for variables and back-end files.
- Project structure  
  The project is composed of 3 main folders : `back-end/`, `front-end/` and `dex/`,  
   There is also a `README.md`, a `CHANGELOG.md`, a `docker-compose.yaml` and `instructions.md`.
- Code quality  
  To have an understandable code, each code is composed with all the imports at the top.  
  Comments are written to explain specific parts. Use of JSX.
- Design, UX  
  For the design of the chat application, I used a lot of MUI components as they are easy to use. I'm not a good designer so it was really helpful. I tried my best for the user to have an intuitive and simple to use experience.
- Git and DevOps  
  As I was alone on this project, I always pushed my commits directly on the main branch.  
  All commits use the same writing conventions (fix/feat : description of the commit.) to have a clear understanding of each commit.

Application development

- Welcome screens  
  On this page, you have access to the channels on the left, you have 3 icons in the middle to create a channel, invite friends to a channel and a link to a settings page.
- New channel creation  
  When clicking on the NewChannel Icon, a popup is displayed with a form to enter the informations about the new channel : Its name, if it's public or not and the possibility to select friends to invite.
- Channel membership and access  
  While creating a channel, a list of users is created and they are permitted to access it.
- Ressource access control  
  _place your graduation and comments_
- Invite users to channels  
  When clicking on the InviteFriends Icon, a popup is displayed with a form to select a channel and select friends to invite. They will be added on the list of authorized users.
- Message modification  
  The messages of the connected user will have an Edit Icon, it will display a popup with a textfield to modify the message.
- Message removal  
  The messages of the connected user will have an Delete Icon, it will delete the message if he clicks on it.
- Account settings  
  The account settings page is not active but the changes will be persistent, you will have informations on your profile with the possibility to activate a night theme, enable or disable notifications, you will also have your Gravatar Picture displayed.
- Gravatar integration  
  The email address of the connected user is used to get the gravatar picture if this address is connected to a gravatar account, if not a random retro picture will be displayed.
