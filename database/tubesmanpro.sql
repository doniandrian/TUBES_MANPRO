-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.30 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.1.0.6537
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for tubesmanpro
DROP DATABASE IF EXISTS `tubesmanpro`;
CREATE DATABASE IF NOT EXISTS `tubesmanpro` /*!40100 DEFAULT CHARACTER SET ucs2 COLLATE ucs2_bin */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `tubesmanpro`;

-- Dumping structure for table tubesmanpro.info
DROP TABLE IF EXISTS `info`;
CREATE TABLE IF NOT EXISTS `info` (
  `username` varchar(50) COLLATE ucs2_bin NOT NULL,
  `file_` varchar(150) COLLATE ucs2_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=ucs2 COLLATE=ucs2_bin;

-- Dumping data for table tubesmanpro.info: ~0 rows (approximately)
DELETE FROM `info`;

-- Dumping structure for table tubesmanpro.people
DROP TABLE IF EXISTS `people`;
CREATE TABLE IF NOT EXISTS `people` (
  `ID` varchar(5) COLLATE ucs2_bin NOT NULL,
  `Year_Birth` int NOT NULL,
  `Education` varchar(20) COLLATE ucs2_bin NOT NULL,
  `Marital_Status` varchar(10) COLLATE ucs2_bin NOT NULL,
  `Income` int DEFAULT NULL,
  `Kidhome` int NOT NULL,
  `Teenhome` int NOT NULL,
  `Dt_Customer` date NOT NULL,
  `Recency` int NOT NULL,
  `Complain` int NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=ucs2 COLLATE=ucs2_bin;

-- Dumping data for table tubesmanpro.people: ~0 rows (approximately)
DELETE FROM `people`;

-- Dumping structure for table tubesmanpro.place
DROP TABLE IF EXISTS `place`;
CREATE TABLE IF NOT EXISTS `place` (
  `ID` varchar(5) COLLATE ucs2_bin NOT NULL,
  `NumWebPurchases` int NOT NULL,
  `NumCatalogPurchases` int NOT NULL,
  `NumStorePurchases` int NOT NULL,
  `NumWebVisitsMonth` int NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=ucs2 COLLATE=ucs2_bin;

-- Dumping data for table tubesmanpro.place: ~0 rows (approximately)
DELETE FROM `place`;

-- Dumping structure for table tubesmanpro.products
DROP TABLE IF EXISTS `products`;
CREATE TABLE IF NOT EXISTS `products` (
  `ID` varchar(5) COLLATE ucs2_bin NOT NULL,
  `MntWines` int NOT NULL,
  `MntFruits` int NOT NULL,
  `MntMeatProducts` int NOT NULL,
  `MntFishProducts` int NOT NULL,
  `MntSweetProducts` int NOT NULL,
  `MntGoldProds` int NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=ucs2 COLLATE=ucs2_bin;

-- Dumping data for table tubesmanpro.products: ~0 rows (approximately)
DELETE FROM `products`;

-- Dumping structure for table tubesmanpro.promotion
DROP TABLE IF EXISTS `promotion`;
CREATE TABLE IF NOT EXISTS `promotion` (
  `ID` varchar(5) COLLATE ucs2_bin NOT NULL,
  `NumDealsPurchases` int NOT NULL,
  `AcceptedCmp1` int NOT NULL,
  `AcceptedCmp2` int NOT NULL,
  `AcceptedCmp3` int NOT NULL,
  `AcceptedCmp4` int NOT NULL,
  `AcceptedCmp5` int NOT NULL,
  `Response` int NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=ucs2 COLLATE=ucs2_bin;

-- Dumping data for table tubesmanpro.promotion: ~0 rows (approximately)
DELETE FROM `promotion`;

-- Dumping structure for table tubesmanpro.users
DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `username` varchar(50) COLLATE ucs2_bin NOT NULL,
  `pass` varchar(50) COLLATE ucs2_bin NOT NULL,
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=ucs2 COLLATE=ucs2_bin;

-- Dumping data for table tubesmanpro.users: ~1 rows (approximately)
DELETE FROM `users`;
INSERT INTO `users` (`username`, `pass`) VALUES
	('admin', 'password');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
