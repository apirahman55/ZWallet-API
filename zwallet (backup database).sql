-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: mysql_container:3306
-- Generation Time: Sep 30, 2020 at 03:38 PM
-- Server version: 8.0.21
-- PHP Version: 7.4.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `zwallet`
--

-- --------------------------------------------------------

--
-- Table structure for table `topup`
--

CREATE TABLE `topup` (
  `id` int NOT NULL,
  `detail` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `topup`
--

INSERT INTO `topup` (`id`, `detail`, `created_at`, `updated_at`) VALUES
(3, 'Type your security number on the ATM or E-Banking.', '2020-09-30 07:05:51', '2020-09-30 07:05:51'),
(4, 'Select “Transfer” in the menu.', '2020-09-30 07:05:58', '2020-09-30 07:05:58'),
(5, 'Type the virtual account number that we provide you at the top.', '2020-09-30 07:06:05', '2020-09-30 07:06:05');

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
  `id` int NOT NULL,
  `id_from_user` int NOT NULL,
  `id_to_user` int NOT NULL,
  `note` varchar(100) NOT NULL,
  `total` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`id`, `id_from_user`, `id_to_user`, `note`, `total`, `created_at`, `updated_at`) VALUES
(3, 13, 1, 'PPPPP', '10000000', '2020-09-30 13:15:50', '2020-09-30 13:15:50');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `phone` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `balance` bigint NOT NULL,
  `verified` tinyint(1) NOT NULL DEFAULT '0',
  `photo` varchar(255) NOT NULL,
  `pin` varchar(10) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `phone`, `email`, `password`, `balance`, `verified`, `photo`, `pin`, `created_at`, `updated_at`) VALUES
(1, 'Api1', '0895379911134', 'apirahman55@gmail.com', 'rara9999', 11100000, 0, '1', '123412', '2020-09-25 14:25:31', '2020-09-25 14:25:31'),
(8, 'Dewa', '08953799111341', 'dewa@gmail.com', '123123', 9990000, 0, '1', '123456', '2020-09-28 15:28:39', '2020-09-28 15:28:39'),
(9, 'Arung', '0812345678', 'Arung@gmail.com', '123123', 9010000, 0, '1', '123456', '2020-09-28 15:28:53', '2020-09-28 15:28:53'),
(11, 'Rizki', '0812345678', 'rizki@gmail.com', '123123', 10000000, 0, '1', '123456', '2020-09-28 15:29:13', '2020-09-28 15:29:13'),
(12, 'Rama', '0812345678', 'rama@gmail.com', '123123', 10000000, 0, '1', '123456', '2020-09-28 15:29:25', '2020-09-28 15:29:25'),
(13, 'fansa', '0812345678', 'fansa@gmail.com', '123123', 0, 0, '1', '123456', '2020-09-28 15:29:35', '2020-09-28 15:29:35'),
(14, 'carmud', '0812345678', 'carmud@gmail.com', '123123', 10000000, 0, '1', '123456', '2020-09-28 15:29:46', '2020-09-28 15:29:46');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `topup`
--
ALTER TABLE `topup`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `frgn_id_from_user` (`id_from_user`),
  ADD KEY `frgn_id_to_user` (`id_to_user`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `topup`
--
ALTER TABLE `topup`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
  ADD CONSTRAINT `frgn_id_from_user` FOREIGN KEY (`id_from_user`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `frgn_id_to_user` FOREIGN KEY (`id_to_user`) REFERENCES `users` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
