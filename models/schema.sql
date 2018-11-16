DROP DATABASE IF EXISTS exampledb;
CREATE DATABASE exampledb;

DROP DATABASE IF EXISTS testdb;
CREATE DATABASE testdb;

-- Drops the "Shareflix" Database if it exists currently --
DROP DATABASE IF EXISTS shareflixDB;
-- Creates the "Shareflix" database --
CREATE DATABASE shareflixDB;



-- Current proposed model
  ________     __________     _____________        
 |_ User _|   |_ Groups _|   |_Shared Apps_|  
 |User_ID |   |Group_ID  |   |App_ID       |
 |Name    |   |Group_Name|   |App Name     |
 |Email   |   |          |   |App_Username |
 |Password|   |          |   |User_ID      |
 |________|   |__________|   |_____________|
      |             |               |
      |             |               |
     /|\           /|\             /|\ 
     \ /___________\ /_____________\ / 
      |_User.App.Group Asscoiation _|    
      |         User_ID             |
      |         Group_ID            |
      |         App_ID              |
      |_____________________________|


-- When a User in a group shares specific applications, that shared applciation gets a unique primary ID