/*
SQLyog Community v13.1.7 (64 bit)
MySQL - 5.7.31 : Database - hjorten
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`hjorten` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_swedish_ci */;

USE `hjorten`;

/*Table structure for table `booking` */

DROP TABLE IF EXISTS `booking`;

CREATE TABLE `booking` (
  `BookingID` int(11) NOT NULL AUTO_INCREMENT,
  `Date` date NOT NULL,
  `GroupID` int(11) NOT NULL,
  `Count` int(11) NOT NULL,
  `Vegetarians` int(11) NOT NULL,
  `EmployeeID` int(11) NOT NULL,
  `ServingID` int(11) NOT NULL,
  `Active` int(1) DEFAULT '1',
  PRIMARY KEY (`BookingID`),
  KEY `GroupID` (`GroupID`),
  KEY `EmployeeID` (`EmployeeID`),
  KEY `ServingID` (`ServingID`),
  CONSTRAINT `booking_ibfk_1` FOREIGN KEY (`GroupID`) REFERENCES `groups` (`GroupID`),
  CONSTRAINT `booking_ibfk_2` FOREIGN KEY (`EmployeeID`) REFERENCES `employees` (`EmployeeID`),
  CONSTRAINT `booking_ibfk_3` FOREIGN KEY (`ServingID`) REFERENCES `servings` (`ServingID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_swedish_ci;

/*Data for the table `booking` */

/*Table structure for table `employeeroles` */

DROP TABLE IF EXISTS `employeeroles`;

CREATE TABLE `employeeroles` (
  `AssignmentID` int(11) NOT NULL AUTO_INCREMENT,
  `EmployeeID` int(11) NOT NULL,
  `RoleID` int(11) NOT NULL,
  PRIMARY KEY (`AssignmentID`),
  KEY `EmployeeID` (`EmployeeID`),
  KEY `RoleID` (`RoleID`),
  CONSTRAINT `employeeroles_ibfk_1` FOREIGN KEY (`EmployeeID`) REFERENCES `employees` (`EmployeeID`),
  CONSTRAINT `employeeroles_ibfk_2` FOREIGN KEY (`RoleID`) REFERENCES `roles` (`RoleID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_swedish_ci;

/*Data for the table `employeeroles` */

/*Table structure for table `employees` */

DROP TABLE IF EXISTS `employees`;

CREATE TABLE `employees` (
  `EmployeeID` int(11) NOT NULL AUTO_INCREMENT,
  `Mail` char(50) COLLATE utf8_swedish_ci NOT NULL,
  `Vegetarian` int(1) DEFAULT '0',
  PRIMARY KEY (`EmployeeID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_swedish_ci;

/*Data for the table `employees` */

/*Table structure for table `excludedates` */

DROP TABLE IF EXISTS `excludedates`;

CREATE TABLE `excludedates` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `Name` char(50) COLLATE utf8_swedish_ci NOT NULL,
  `Date` date NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_swedish_ci;

/*Data for the table `excludedates` */

/*Table structure for table `grouphandlers` */

DROP TABLE IF EXISTS `grouphandlers`;

CREATE TABLE `grouphandlers` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `EmployeeID` int(11) NOT NULL,
  `GroupID` int(11) NOT NULL,
  `Primary` int(1) DEFAULT '0',
  PRIMARY KEY (`ID`),
  KEY `EmployeeID` (`EmployeeID`),
  KEY `GroupID` (`GroupID`),
  CONSTRAINT `grouphandlers_ibfk_1` FOREIGN KEY (`EmployeeID`) REFERENCES `employees` (`EmployeeID`),
  CONSTRAINT `grouphandlers_ibfk_2` FOREIGN KEY (`GroupID`) REFERENCES `groups` (`GroupID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_swedish_ci;

/*Data for the table `grouphandlers` */

/*Table structure for table `groups` */

DROP TABLE IF EXISTS `groups`;

CREATE TABLE `groups` (
  `GroupID` int(11) NOT NULL AUTO_INCREMENT,
  `Name` char(50) COLLATE utf8_swedish_ci NOT NULL,
  `Count` int(11) NOT NULL DEFAULT '0',
  `Vegetarians` int(11) DEFAULT '0',
  PRIMARY KEY (`GroupID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_swedish_ci;

/*Data for the table `groups` */

/*Table structure for table `logs` */

DROP TABLE IF EXISTS `logs`;

CREATE TABLE `logs` (
  `LogID` int(11) NOT NULL AUTO_INCREMENT,
  `Datetime` datetime NOT NULL,
  `EmployeeID` int(11) NOT NULL,
  `BookingID` int(11) NOT NULL,
  `Event` char(255) COLLATE utf8_swedish_ci NOT NULL,
  PRIMARY KEY (`LogID`),
  KEY `EmployeeID` (`EmployeeID`),
  KEY `BookingID` (`BookingID`),
  CONSTRAINT `logs_ibfk_1` FOREIGN KEY (`EmployeeID`) REFERENCES `employees` (`EmployeeID`),
  CONSTRAINT `logs_ibfk_2` FOREIGN KEY (`BookingID`) REFERENCES `booking` (`BookingID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_swedish_ci;

/*Data for the table `logs` */

/*Table structure for table `periods` */

DROP TABLE IF EXISTS `periods`;

CREATE TABLE `periods` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `Name` char(50) COLLATE utf8_swedish_ci NOT NULL,
  `Start_date` date NOT NULL,
  `End_date` date NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_swedish_ci;

/*Data for the table `periods` */

/*Table structure for table `roles` */

DROP TABLE IF EXISTS `roles`;

CREATE TABLE `roles` (
  `RoleID` int(11) NOT NULL AUTO_INCREMENT,
  `Role` char(50) COLLATE utf8_swedish_ci NOT NULL,
  PRIMARY KEY (`RoleID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_swedish_ci;

/*Data for the table `roles` */

/*Table structure for table `servings` */

DROP TABLE IF EXISTS `servings`;

CREATE TABLE `servings` (
  `ServingID` int(11) NOT NULL AUTO_INCREMENT,
  `Name` char(1) COLLATE utf8_swedish_ci NOT NULL,
  `Time` time NOT NULL,
  PRIMARY KEY (`ServingID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_swedish_ci;

/*Data for the table `servings` */

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
