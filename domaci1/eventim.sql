-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 26, 2025 at 05:48 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `eventim`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `description`, `created_at`, `updated_at`) VALUES
(1, 'Conference', 'Višednevni i jednodnevni događaji sa predavanjima i panelima.', '2025-09-26 12:29:48', '2025-09-26 12:29:48'),
(2, 'Workshop', 'Praktične radionice sa manjim grupama i mentorisanjem.', '2025-09-26 12:29:48', '2025-09-26 12:29:48'),
(3, 'Meetup', 'Neformalna okupljanja zajednice uz kraća predavanja.', '2025-09-26 12:29:48', '2025-09-26 12:29:48'),
(4, 'Concert', 'Muzicki događaji – solo nastupi i bendovi.', '2025-09-26 12:29:48', '2025-09-26 12:29:48'),
(5, 'Webinar', 'Online predavanja i demonstracije alata/tehnologija.', '2025-09-26 12:29:48', '2025-09-26 12:29:48');

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `start_time` datetime NOT NULL,
  `end_time` datetime DEFAULT NULL,
  `category_id` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `title`, `description`, `location`, `start_time`, `end_time`, `category_id`, `created_at`, `updated_at`) VALUES
(1, 'Laravel Srbija Meetup', 'Dva kratka predavanja i networking uz pizzu.', 'Beograd, ICT Hub', '2025-10-06 18:00:00', '2025-10-06 20:00:00', 3, '2025-09-26 12:29:48', '2025-09-26 12:29:48'),
(2, 'Frontend Workshop: React Basics', 'Praktična radionica – kreiranje SPA aplikacije od nule.', 'Novi Sad, Startit Centar', '2025-10-11 10:00:00', '2025-10-11 14:00:00', 2, '2025-09-26 12:29:48', '2025-09-26 12:29:48'),
(3, 'Tech Conference: Data & AI 2025', 'Konferencija o primeni veštačke inteligencije i analitike podataka.', 'Beograd, Sava Centar', '2025-10-26 09:00:00', '2025-10-26 17:00:00', 1, '2025-09-26 12:29:48', '2025-09-26 12:29:48'),
(4, 'Acoustic Night', 'Veče akustične muzike lokalnih izvođača.', 'Niš, Gradski kulturni centar', '2025-10-01 20:00:00', '2025-10-01 22:00:00', 4, '2025-09-26 12:29:48', '2025-09-26 12:29:48'),
(5, 'Remote Webinar: Intro to Docker', 'Osnove dockera, images, containers i best practices.', 'Online', '2025-10-03 18:00:00', '2025-10-03 19:30:00', 5, '2025-09-26 12:29:48', '2025-09-26 12:29:48');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2014_10_12_000000_create_users_table', 1),
(2, '2014_10_12_100000_create_password_reset_tokens_table', 1),
(3, '2019_08_19_000000_create_failed_jobs_table', 1),
(4, '2019_12_14_000001_create_personal_access_tokens_table', 1),
(5, '2025_09_26_132050_add_role_to_users_table', 1),
(6, '2025_09_26_132108_create_categories_table', 1),
(7, '2025_09_26_132127_create_events_table', 1),
(8, '2025_09_26_132132_create_tickets_table', 1),
(9, '2025_09_26_132352_add_foreign_keys_to_event_and_ticket_tables', 1),
(10, '2025_09_26_132403_add_unique_constraints', 1),
(11, '2025_09_26_132429_add_indexes', 1);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(1, 'App\\Models\\User', 7, 'auth_token', 'a401f8fde103cbd238f08fb30742a3170016d6ac4c17199282ceb2a95782a2e7', '[\"*\"]', NULL, NULL, '2025-09-26 13:08:50', '2025-09-26 13:08:50'),
(2, 'App\\Models\\User', 7, 'auth_token', '9992feaab54b88e398e57041e56fd9f57720873851c729f96bec57bf6f92e7fc', '[\"*\"]', NULL, NULL, '2025-09-26 13:09:46', '2025-09-26 13:09:46'),
(3, 'App\\Models\\User', 1, 'auth_token', '4469ad8807e30fdb7ba705ba8197ed13902955291edb093c94993819145a5139', '[\"*\"]', '2025-09-26 13:42:36', NULL, '2025-09-26 13:13:05', '2025-09-26 13:42:36'),
(4, 'App\\Models\\User', 7, 'auth_token', '20afacd06c272bad02fbef73a55599e88592333752baeca2a8032a0f9788de7c', '[\"*\"]', '2025-09-26 13:40:51', NULL, '2025-09-26 13:38:34', '2025-09-26 13:40:51');

-- --------------------------------------------------------

--
-- Table structure for table `tickets`
--

CREATE TABLE `tickets` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `event_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `status` enum('pending','confirmed','cancelled') NOT NULL DEFAULT 'pending',
  `price` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tickets`
--

INSERT INTO `tickets` (`id`, `event_id`, `user_id`, `status`, `price`, `created_at`, `updated_at`) VALUES
(1, 1, 2, 'pending', 0.00, '2025-09-26 12:29:49', '2025-09-26 12:29:49'),
(2, 1, 3, 'pending', 0.00, '2025-09-26 12:29:49', '2025-09-26 12:29:49'),
(3, 1, 5, 'confirmed', 0.00, '2025-09-26 12:29:49', '2025-09-26 12:29:49'),
(4, 1, 6, 'confirmed', 0.00, '2025-09-26 12:29:49', '2025-09-26 12:29:49'),
(5, 2, 2, 'confirmed', 1200.00, '2025-09-26 12:29:49', '2025-09-26 12:29:49'),
(6, 2, 4, 'confirmed', 1200.00, '2025-09-26 12:29:49', '2025-09-26 12:29:49'),
(7, 2, 5, 'pending', 1200.00, '2025-09-26 12:29:49', '2025-09-26 12:29:49'),
(8, 2, 6, 'confirmed', 1200.00, '2025-09-26 12:29:49', '2025-09-26 12:29:49'),
(9, 3, 2, 'confirmed', 3000.00, '2025-09-26 12:29:49', '2025-09-26 12:29:49'),
(10, 3, 3, 'pending', 3000.00, '2025-09-26 12:29:49', '2025-09-26 12:29:49'),
(11, 4, 2, 'confirmed', 1800.00, '2025-09-26 12:29:49', '2025-09-26 12:29:49'),
(12, 4, 3, 'pending', 1800.00, '2025-09-26 12:29:49', '2025-09-26 12:29:49'),
(13, 4, 4, 'confirmed', 1800.00, '2025-09-26 12:29:49', '2025-09-26 12:29:49'),
(14, 4, 6, 'pending', 1800.00, '2025-09-26 12:29:49', '2025-09-26 12:29:49'),
(15, 5, 2, 'pending', 0.00, '2025-09-26 12:29:49', '2025-09-26 12:29:49'),
(16, 5, 4, 'confirmed', 0.00, '2025-09-26 12:29:49', '2025-09-26 12:29:49'),
(17, 5, 7, 'confirmed', 10.00, '2025-09-26 13:39:29', '2025-09-26 13:42:36');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','user') NOT NULL DEFAULT 'user',
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `role`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Admin User', 'admin@events.local', '2025-09-26 12:29:47', '$2y$12$FoIna2Vv1clsRtMJ/w9.leQDX9G3mubYvjqYKHiS2C88O6rfQ/WsG', 'admin', 'p0SHsBEvVa', '2025-09-26 12:29:47', '2025-09-26 12:29:47'),
(2, 'Nikola Nikolić', 'nikola@events.local', '2025-09-26 12:29:48', '$2y$12$ThZBvWPMQi6Jx6uzfw9ZROj5OviTErfGyhN9lELrr42.WaZi/S/5K', 'user', 'NYGvF0kEY0', '2025-09-26 12:29:48', '2025-09-26 12:29:48'),
(3, 'Ana Petrović', 'ana@events.local', '2025-09-26 12:29:48', '$2y$12$aee7BgabAa6q8SVRq9voCupB1nuPTSczp4arR3ZQL48PplUVJ3YrG', 'user', 'PxBVJ3lLBY', '2025-09-26 12:29:48', '2025-09-26 12:29:48'),
(4, 'Marko Jovanović', 'marko@events.local', '2025-09-26 12:29:48', '$2y$12$RwBGkYFbx/PxVQ8i2bbjqeHPT.RHQoyaTyL092pB.dKNeEL3lXREy', 'user', 'CPcPHQPNB3', '2025-09-26 12:29:48', '2025-09-26 12:29:48'),
(5, 'Milica Ilić', 'milica@events.local', '2025-09-26 12:29:48', '$2y$12$c73wR7GO0zK/hapYoEMqyOB9ImSt37KR3FT46GsNPwlWnIAiaPlw2', 'user', '1zmISF7pOs', '2025-09-26 12:29:48', '2025-09-26 12:29:48'),
(6, 'Jovan Nikolić', 'jovan@events.local', '2025-09-26 12:29:48', '$2y$12$aEtdbBeYBzE3pyyEg.k7fO.tnranqqLNMbA1G94X25Aa3gUzF/9ve', 'user', 'oU0kDsIgQn', '2025-09-26 12:29:48', '2025-09-26 12:29:48'),
(7, 'Biljana', 'biljana@mail.com', NULL, '$2y$12$GPXI9qe.nt4lTXuKioroNOP5IMyl7jPZ1wqJi5ETnAk8hhpkcH7Fa', 'user', NULL, '2025-09-26 13:08:50', '2025-09-26 13:08:50');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `categories_name_unique` (`name`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`),
  ADD KEY `events_category_id_foreign` (`category_id`),
  ADD KEY `events_start_time_idx` (`start_time`),
  ADD KEY `events_location_idx` (`location`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Indexes for table `tickets`
--
ALTER TABLE `tickets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `tickets_event_user_unique` (`event_id`,`user_id`),
  ADD KEY `tickets_user_id_foreign` (`user_id`),
  ADD KEY `tickets_status_idx` (`status`),
  ADD KEY `tickets_created_at_idx` (`created_at`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `tickets`
--
ALTER TABLE `tickets`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `events`
--
ALTER TABLE `events`
  ADD CONSTRAINT `events_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `tickets`
--
ALTER TABLE `tickets`
  ADD CONSTRAINT `tickets_event_id_foreign` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `tickets_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
