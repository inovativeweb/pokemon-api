-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: mysql:3306
-- Generation Time: Apr 28, 2020 at 07:39 PM
-- Server version: 5.7.29
-- PHP Version: 7.4.5

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

CREATE USER 'testnode'@'localhost' IDENTIFIED BY '123456';
CREATE DATABASE testnode;
GRANT ALL ON testnode.* To 'testnode'@'localhost';
FLUSH PRIVILEGES;
REVOKE ALL PRIVILEGES ON *.* FROM 'testnode'@'%'; 
GRANT ALL PRIVILEGES ON *.* TO 'testnode'@'%' REQUIRE NONE WITH GRANT OPTION MAX_QUERIES_PER_HOUR 0 MAX_CONNECTIONS_PER_HOUR 0 MAX_UPDATES_PER_HOUR 0 MAX_USER_CONNECTIONS 0;
FLUSH PRIVILEGES;
USE testnode; 

--
-- Database: `testnode`
--

-- --------------------------------------------------------

--
-- Table structure for table `pokemons`
--

CREATE TABLE `pokemons` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `pokemon_id` int(11) NOT NULL,
  `team_id` int(11) NOT NULL,
  `base_experience` int(11) NOT NULL,
  `image` varchar(500) NOT NULL,
  `ability_name` varchar(500) NOT NULL,
  `type_name` varchar(500) NOT NULL,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `pokemon_types`
--

CREATE TABLE `pokemon_types` (
  `id_type` int(11) NOT NULL,
  `id_pokemon` int(11) NOT NULL,
  `id_team` int(11) NOT NULL,
  `type_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `teams`
--

CREATE TABLE `teams` (
  `id` int(11) NOT NULL,
  `team_name` varchar(255) NOT NULL,
  `created_date` varchar(40) DEFAULT NULL,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted` tinyint(4) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `pokemons`
--
ALTER TABLE `pokemons`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `pokemon_id` (`pokemon_id`);

--
-- Indexes for table `pokemon_types`
--
ALTER TABLE `pokemon_types`
  ADD PRIMARY KEY (`id_type`),
  ADD UNIQUE KEY `id_type` (`id_type`),
  ADD KEY `id_type_2` (`id_type`);

--
-- Indexes for table `teams`
--
ALTER TABLE `teams`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `pokemons`
--
ALTER TABLE `pokemons`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pokemon_types`
--
ALTER TABLE `pokemon_types`
  MODIFY `id_type` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `teams`
--
ALTER TABLE `teams`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

