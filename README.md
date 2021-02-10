# Authentico

[![Build Status](https://www.travis-ci.com/YashKumarVerma/authentico-backend.svg?token=bdYdpM7ki4qrmdCwJmGf&branch=master)](https://www.travis-ci.com/YashKumarVerma/authentico-backend) ![Ensure Build](https://github.com/YashKumarVerma/authentico-backend/workflows/Ensure%20Build/badge.svg)

## Objective
The detailed objective is available on the [/UniAuth](https://github.com/UniAuth/UniAuth) repository. 

---
## Docs
- Code Documentation: [Compodocs](http://uniauth.surge.sh/)

## Running on Local System
Running the project on local system is **strongly recommended**, even if you are not working on the backend. This is becuase to test the middlewars, client applications, or any other component, an instance of UniAuth OAuth server is required. Make sure that you have a mongodb instance running. This step might be different depending on your installation type. If you do not have mongodb database installed, refer [this link](https://docs.mongodb.com/manual/administration/install-community/)

- Clone the repository to your system using `git clone https://github.com/UniAuth/uniauth-backend`
- Now open the cloned repository using `cd uniauth-backend`
- The project depends on numerous npm packages. Install them using `yarn install` or `npm install`
- Run `yarn start:dev` or `npm run start:dev` to launch a development server. 
- Open [localhost:5000](http://localhost:5000) and ensure that the server is running.

Seems a long process? We have an open issue to [create a docker image](https://github.com/UniAuth/uniauth-backend/issues/9) to make this short. Help us out by sending a pr. 

## Creating an Application
Once you have a server running(use the above steps if not), now you'll need to create a user account and application credentials just like any other user would. The steps are:

- Open [localhost:5000/account/register](http://localhost:5000/account/register) and fill in your details. Enter any random 9 digit word for registration number. This is added to demonstrate that custom fields can be added during registration itself.      
There are some validations in the system , so kindly follow the following format :        
Format for registration number : [2 digit year][3 character code][4 digit number]     
Example: 19BCE2669, 19MIT0001, 20BTC0010 etc.

![Registration page](https://i.imgur.com/m0LFVtq.png)

- The page will ask you to _please check your email for verification link_. The email part is not integrated yet. So nothing to be done here. Head towards login and use the email and password you used to register right now.
- Once logged in, you will see your dashboard. **Please note that these are placeholder images only**.
- Head towards "[Dev Arena](http://localhost:5000/dashboard/dev)" and click on "**`New Application`**"
- Enter the details of the application and click on "**`Create Application`**". Ideally the page must refresh itself, if it doesn't, then manually refresh it. (create issue for this please).
![Application Details](https://i.imgur.com/n5CrmDA.png)

- Here you can see the details of the newly created application.
<p align="center">
  <img src="https://i.imgur.com/g8TTpWt.png" alt="Application Details" /></a>
</p>

- Now you can use the application details in middlewares and clients.

## UniAuth Flow
![OAuth Flow](https://i.imgur.com/gPz32GC.png)

## Consent Screen
The user sees the following screen when during login
![Simple Consent Screen for event](https://i.imgur.com/r2fve6v.png) 


## Technologies Used
- Backend 
  - Written in [NodeJS](https://nodejs.org/en/)
  - Using [NestJS](https://nestjs.com/)
  - In [TypeScript](https://www.typescriptlang.org/)
  - Transpiles to [JavaScript](https://www.javascript.com/)
  - Auth using [JWT](https://jwt.io/) and [Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)
- Frontend
  - Written in HTML, CSS and JS
  - Using [TailWindCSS](https://tailwindcss.com/)
  - Inside [Handlebar](https://handlebarsjs.com/)
- Database 
  - [MongoDB](https://docs.mongodb.com/) via [Mongoose](https://mongoosejs.com/)

