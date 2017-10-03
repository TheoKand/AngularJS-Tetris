# AngularJS Tetris

This is an original AngularJS + Javascript version of the most popular video game ever. Some refactoring is due, to follow best practices.

Demo: http://angulartetris20170918013407.azurewebsites.net/App/

![Alt text](https://github.com/TheoKand/AngularTetris/blob/master/Screenshots/1.png)
![Alt text](https://github.com/TheoKand/AngularTetris/blob/master/Screenshots/2.png)
![Alt text](https://github.com/TheoKand/AngularTetris/blob/master/Screenshots/3.png)

# Tech stack
The project is built using the following technologies:

- Javascript
- AngularJS 1.6.4
- Bootstrap 3.3.7
- JQuery 1.9.1
- WebAPI
- MySql + Entity Framework

It's a fully responsive Single Page Application which means that it's usable on any type of device like mobiles and tablets. When accessed with a touch screen device, an on-screen virtual keyboard is used.The highscores are saved in a MySql database through a WebAPI service. The data layer is built with the ADO.NET Entity Data Model. The application is published on the cloud using Microsoft Azure.

# Introduction
The project conists of just one ASP.NET Web Application that contains both the server-side components and client-side components. The client-side AngularJS application is implemented in the subfolder AngularJS-App. The rest of the folders contain the server-side WebAPI functionality and database-related functionality.


