-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: May 10, 2026 at 08:21 AM
-- Server version: 10.11.16-MariaDB
-- PHP Version: 8.4.20

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `imagegro_yamaha_tecknoz`
--

-- --------------------------------------------------------

--
-- Table structure for table `app_settings`
--

CREATE TABLE `app_settings` (
  `setting_key` varchar(100) NOT NULL,
  `setting_value` varchar(255) NOT NULL,
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `app_settings`
--

INSERT INTO `app_settings` (`setting_key`, `setting_value`, `updated_at`) VALUES
('max_daily_generations', '10', '2026-05-05 15:37:04'),
('max_hourly_generations', '5', '2026-04-28 06:11:54'),
('max_monthly_generations', '50', '2026-04-28 06:30:54'),
('max_weekly_generations', '15', '2026-04-28 06:30:54');

-- --------------------------------------------------------

--
-- Table structure for table `bikes`
--

CREATE TABLE `bikes` (
  `id` int(11) NOT NULL,
  `model_name` varchar(255) NOT NULL,
  `type` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `colors` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`colors`)),
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bikes`
--

INSERT INTO `bikes` (`id`, `model_name`, `type`, `description`, `image_url`, `colors`, `created_at`) VALUES
(33, 'Yamaha Aerox155', 'Scooter', NULL, NULL, '[\"Metallic Black\",\"Grey Vermillion\",\"Racing Blue\",\"Silver\"]', '2026-05-09 20:21:10'),
(34, 'Yamaha Fazer', 'Commuter', NULL, NULL, '[\"Black\",\"Red\",\"Dark Matt Blue\"]', '2026-05-09 20:21:10'),
(35, 'Yamaha FZ-25', 'Naked', NULL, NULL, '[\"Black\",\"Racing Blue\",\"White\"]', '2026-05-09 20:21:10'),
(36, 'Yamaha FZS V2', 'Naked', NULL, NULL, '[\"Blue\",\"Black\",\"Matt Grey\",\"Black Metallic\",\"Grey Metallic\"]', '2026-05-09 20:21:10'),
(37, 'Yamaha FZS V3', 'Naked', NULL, NULL, '[\"Matt Blue\",\"Matt Black\",\"White\",\"Metallic Red\",\"Matt Red\",\"Vintage Green\",\"Metallic Black\",\"Majesty Red\",\"Metallic Grey\"]', '2026-05-09 20:21:10'),
(38, 'Yamaha FZS V4', 'Naked', NULL, NULL, '[\"Racing Blue\",\"Matt Black (Golden Wheel)\",\"Metallic Grey\",\"Matt Blue\",\"Matt Black (Black Wheel)\",\"Majesty Red\",\"Ice Fluo Vermillion\",\"Sparkle Green\"]', '2026-05-09 20:21:10'),
(39, 'Yamaha FZX', 'Naked', NULL, NULL, '[\"Matt Copper\",\"Matt Black\",\"Metallic Blue\",\"Matt Blue\",\"Matt Titan\"]', '2026-05-09 20:21:10'),
(40, 'Yamaha MT 15', 'Naked', NULL, NULL, '[\"Blue\",\"Black\"]', '2026-05-09 20:21:10'),
(41, 'Yamaha MT15 V2', 'Naked', NULL, NULL, '[\"Metallic Black\",\"Racing Blue\",\"Cyan Storm\",\"Ice Fluo\"]', '2026-05-09 20:21:10'),
(42, 'Yamaha R15 V3', 'Sports', NULL, NULL, '[\"Racing Blue\",\"Thunder Grey\",\"Dark Knight\"]', '2026-05-09 20:21:10'),
(43, 'Yamaha R15 V4', 'Sports', NULL, NULL, '[\"Racing Blue\",\"Dark Knight\",\"Metallic Red\",\"Intensity\"]', '2026-05-09 20:21:10'),
(44, 'Yamaha R15M', 'Sports', NULL, NULL, '[\"Metallic Grey\",\"Metallic Grey (Without TFT)\"]', '2026-05-09 20:21:10'),
(45, 'Yamaha Ray ZR 113', 'Scooter', NULL, NULL, '[\"Blue\",\"Grey\"]', '2026-05-09 20:21:10'),
(46, 'Yamaha Ray ZR 125', 'Scooter', NULL, NULL, '[\"Blue\",\"Green\"]', '2026-05-09 20:21:10'),
(47, 'Yamaha Saluto', 'Commuter', NULL, NULL, '[\"Black\",\"Blue\",\"Purplish Blue\",\"Sparkle Green\",\"Pastel Dark Grey\"]', '2026-05-09 20:21:10'),
(48, 'Yamaha XSR', 'Naked', NULL, NULL, '[\"White\",\"White Metalic\",\"Matt Green\"]', '2026-05-09 20:21:10'),
(49, 'Yamaha FZS Hybrid', 'Naked', NULL, NULL, '[\"Cyan Metallic\",\"Racing Blue\",\"Matte Black\"]', '2026-05-09 20:21:10'),
(50, 'Yamaha R15M (Monster)', 'Sports', NULL, NULL, '[\"Black (Monster)\"]', '2026-05-09 20:21:10');

-- --------------------------------------------------------

--
-- Table structure for table `generations`
--

CREATE TABLE `generations` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `bike_id` int(11) NOT NULL,
  `generated_image_url` varchar(500) DEFAULT NULL,
  `persona_title` text DEFAULT NULL,
  `traits_summary` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `hash_id` varchar(50) DEFAULT NULL,
  `status` enum('processing','completed','failed') DEFAULT 'completed'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `generations`
--

INSERT INTO `generations` (`id`, `user_id`, `bike_id`, `generated_image_url`, `persona_title`, `traits_summary`, `created_at`, `hash_id`, `status`) VALUES
(36, 5, 42, 'https://yamaha-ai-generations-2026.s3.ap-south-1.amazonaws.com/generations/gen_81f5db5e6f61896161343470944da1f2.jpg', '{\"behavior\":3,\"destination\":\"Cyber City\",\"destination_meta\":{\"personality\":\"The Next-Gen Visionary: Driven by technology, futuristic lifestyles, and bold, high-energy urban identities.\",\"scene\":\"A cinematic futuristic cyberpunk city center, reimagined NYC or London-inspired urban skyline, neon lights, glowing digital billboards, futuristic skyscrapers, reflective wet road, high-tech atmosphere, subtle Ferris wheel visible in the far background, dramatic night lighting, premium cinematic realism, powerful next-generation city mood.\"},\"aspiration\":\"Vitality and zest\",\"aspiration_meta\":{\"color\":\"Red\",\"final_color\":\"Racing Blue\"}}', 'As the Next-Gen Visionary who charts the electrifying pulse of the Cyber City, your Yamaha R15 V3 is a seamless extension of your bold, futuristic spirit. It’s where engineered precision empowers your boundless vitality, transforming every journey into a vivid Racing Blue declaration of your exhilarating zest for life.', '2026-05-09 21:05:47', '81f5db5e6f61896161343470944da1f2', 'completed'),
(37, 5, 38, 'https://yamaha-ai-generations-2026.s3.ap-south-1.amazonaws.com/generations/gen_37f649fd66788ae06d32a0f2d9c71809.jpg', '{\"behavior\":12,\"destination\":\"Off-Roads\",\"destination_meta\":{\"personality\":\"The Adventurous Trailblazer: Defined by toughness, exploration, and a passion for raw riding energy.\",\"scene\":\"A cinematic off-road racing trail, uneven dirt road, rocky terrain, dust particles, rugged hills and mountains in the background, dramatic wide sky, adventurous riding atmosphere, premium realistic outdoor photography, powerful off-road mood, high-detail terrain, cinematic action-ready composition.\"},\"aspiration\":\"Vitality and zest\",\"aspiration_meta\":{\"color\":\"Red\",\"final_color\":\"Majesty Red\"}}', 'For the Adventurous Trailblazer, your spirit blazes with a Majesty Red vitality, transforming every uncharted path into your personal domain. The Yamaha FZS V4 then becomes the ultimate expression of that raw riding energy, precisely engineered to amplify your audacious command of the journey ahead.', '2026-05-09 21:34:57', '37f649fd66788ae06d32a0f2d9c71809', 'completed'),
(38, 5, 34, 'https://yamaha-ai-generations-2026.s3.ap-south-1.amazonaws.com/generations/gen_e73648ea3f63cc4f59bbf2e5c3177c77.jpg', '{\"behavior\":13,\"destination\":\"Hills\",\"destination_meta\":{\"personality\":\"The Nature Enthusiast: Values peace, elevation, and the refreshing spirit of scenic mountain adventures.\",\"scene\":\"A cinematic winding hill road through lush green mountains, layered hills in the background, soft morning mist, pine trees, golden-hour sunlight, clear open road, fresh mountain atmosphere, realistic scenic travel photography, premium cinematic depth, peaceful adventurous riding mood.\"},\"aspiration\":\"Vitality and zest\",\"aspiration_meta\":{\"color\":\"Red\",\"final_color\":\"Red\"}}', 'We understand your discerning spirit finds true vitality amidst the serene majesty of winding mountain passes and golden-hour ascents. Your Yamaha Fazer is not merely a vehicle, but the finely tuned instrument that amplifies your inherent vitality and ignites your zest with every sweeping curve.', '2026-05-09 21:53:05', 'e73648ea3f63cc4f59bbf2e5c3177c77', 'completed'),
(39, 6, 48, 'https://yamaha-ai-generations-2026.s3.ap-south-1.amazonaws.com/generations/gen_554aa57c523aba256bcd0353ec15013f.jpg', '{\"behavior\":15,\"destination\":\"Beaches\",\"destination_meta\":{\"personality\":\"The Serene Traveler: Motivated by freedom, calmness, and the relaxation of scenic coastal experiences.\",\"scene\":\"A serene coastal marine drive road beside a tropical Maldives-style beach. Crystal-clear blue ocean, white sand, palm trees, and luxury beach villas in the background. Soft sunlight with a calm sea breeze mood. Open scenic road, realistic premium travel photography, cinematic composition, peaceful and aspirational atmosphere.\"},\"aspiration\":\"Mastery and depth\",\"aspiration_meta\":{\"color\":\"Black\",\"final_color\":\"White\"}}', 'Your spirit seeks the profound calm of horizon-kissed shores, where crystal waters meet aspirational white sands and the open road promises serene mastery. The Yamaha XSR, a meticulously crafted testament to authentic connection, stands ready to amplify this very freedom, elevating every serene mile towards your purest, aspirational white.', '2026-05-09 21:55:33', '554aa57c523aba256bcd0353ec15013f', 'completed'),
(40, 7, 44, 'https://yamaha-ai-generations-2026.s3.ap-south-1.amazonaws.com/generations/gen_a5ba501d67a626691af6e8b9ee019ced.jpg', '{\"behavior\":3,\"destination\":\"City Life \",\"destination_meta\":{\"personality\":\"The Modern Urbanite: Driven by sophistication, nightlife energy, and a premium metropolitan identity.\",\"scene\":\"A cinematic modern city night road with a long, clean asphalt street stretching into the distance. Tall glass skyscrapers, glowing LED billboards, and premium shopfronts line both sides. Inspired by a blend of NYC and Singapore. Bright urban streetlights with realistic reflections on the road surface. High-detail realistic environment, premium automotive photography style, cinematic depth.\"},\"aspiration\":\"Mastery and depth\",\"aspiration_meta\":{\"color\":\"Black\",\"final_color\":\"Metallic Grey\"}}', 'For the Modern Urbanite, where mastery and depth define every aspiration, the Yamaha R15M becomes an exquisite extension of your refined spirit within the glittering cityscape. This isn\'t just a ride; it\'s a sleek, metallic grey statement, perfectly reflecting your sophisticated command of the nocturnal metropolis.', '2026-05-09 21:56:42', 'a5ba501d67a626691af6e8b9ee019ced', 'completed'),
(41, 5, 41, 'https://yamaha-ai-generations-2026.s3.ap-south-1.amazonaws.com/generations/gen_e7ece6db5404371344f877ef035a0193.jpg', '{\"behavior\":3,\"destination\":\"City Life \",\"destination_meta\":{\"personality\":\"The Modern Urbanite: Driven by sophistication, nightlife energy, and a premium metropolitan identity.\",\"scene\":\"A cinematic modern city night road with a long, clean asphalt street stretching into the distance. Tall glass skyscrapers, glowing LED billboards, and premium shopfronts line both sides. Inspired by a blend of NYC and Singapore. Bright urban streetlights with realistic reflections on the road surface. High-detail realistic environment, premium automotive photography style, cinematic depth.\"},\"aspiration\":\"Mastery and depth\",\"aspiration_meta\":{\"color\":\"Black\",\"final_color\":\"Metallic Black\"}}', 'To the discerning Modern Urbanite, whose every journey is a sophisticated pursuit of mastery and the city\'s vibrant pulse. The Yamaha MT15 V2 isn\'t just ridden; it\'s your metallic black instrument, perfectly poised to orchestrate a dynamic, precise presence across the glowing urban landscape.', '2026-05-09 22:08:44', 'e7ece6db5404371344f877ef035a0193', 'completed'),
(42, 8, 42, 'https://yamaha-ai-generations-2026.s3.ap-south-1.amazonaws.com/generations/gen_656274bbd56706b0148ed8768dfe0bf6.jpg', '{\"behavior\":3,\"destination\":\"City Life \",\"destination_meta\":{\"personality\":\"The Modern Urbanite: Driven by sophistication, nightlife energy, and a premium metropolitan identity.\",\"scene\":\"A cinematic modern city night road with a long, clean asphalt street stretching into the distance. Tall glass skyscrapers, glowing LED billboards, and premium shopfronts line both sides. Inspired by a blend of NYC and Singapore. Bright urban streetlights with realistic reflections on the road surface. High-detail realistic environment, premium automotive photography style, cinematic depth.\"},\"aspiration\":\"Mastery and depth\",\"aspiration_meta\":{\"color\":\"Black\",\"final_color\":\"Racing Blue\"}}', 'As a modern urbanite, you don\'t just navigate the city\'s electric pulse; you master it, turning every illuminated avenue into your personal stage. It\'s why the precision of the Yamaha R15 V3, cloaked in its aspirational Racing Blue, is the perfect extension of your pursuit for urban mastery and depth.', '2026-05-09 22:14:37', '656274bbd56706b0148ed8768dfe0bf6', 'completed'),
(43, 8, 35, 'https://yamaha-ai-generations-2026.s3.ap-south-1.amazonaws.com/generations/gen_4416da8029a3faef3829606a7081e501.jpg', '{\"behavior\":13,\"destination\":\"Hills\",\"destination_meta\":{\"personality\":\"The Nature Enthusiast: Values peace, elevation, and the refreshing spirit of scenic mountain adventures.\",\"scene\":\"A cinematic winding hill road through lush green mountains, layered hills in the background, soft morning mist, pine trees, golden-hour sunlight, clear open road, fresh mountain atmosphere, realistic scenic travel photography, premium cinematic depth, peaceful adventurous riding mood.\"},\"aspiration\":\"Mastery and depth\",\"aspiration_meta\":{\"color\":\"Black\",\"final_color\":\"Black\"}}', 'For the discerning spirit drawn to the tranquil majesty of winding mountain roads, your journey is a profound quest for mastery amidst nature\'s breathtaking canvas. Your Yamaha FZ-25, engineered with sculpted agility and responsive power, becomes the seamless extension of that adventurous soul, effortlessly carving through each golden-hour curve towards elevated horizons.', '2026-05-09 22:20:36', '4416da8029a3faef3829606a7081e501', 'completed'),
(44, 9, 45, 'https://yamaha-ai-generations-2026.s3.ap-south-1.amazonaws.com/generations/gen_700fb7d6224b72fe8f1b7b882168f8bc.jpg', '{\"behavior\":2,\"destination\":\"Off-Roads\",\"destination_meta\":{\"personality\":\"The Adventurous Trailblazer: Defined by toughness, exploration, and a passion for raw riding energy.\",\"scene\":\"A cinematic off-road racing trail, uneven dirt road, rocky terrain, dust particles, rugged hills and mountains in the background, dramatic wide sky, adventurous riding atmosphere, premium realistic outdoor photography, powerful off-road mood, high-detail terrain, cinematic action-ready composition.\"},\"aspiration\":\"Boundless potential\",\"aspiration_meta\":{\"color\":\"Blue\",\"final_color\":\"Blue\"}}', 'You, the Adventurous Trailblazer, possess an inherent toughness and a passion for raw riding energy, fueling your boundless potential. The Yamaha Ray ZR 113 is not merely a vehicle, but the agile embodiment of that spirit, meticulously engineered to amplify your every audacious exploration.', '2026-05-10 05:47:45', '700fb7d6224b72fe8f1b7b882168f8bc', 'completed'),
(45, 10, 43, 'https://yamaha-ai-generations-2026.s3.ap-south-1.amazonaws.com/generations/gen_81b4f3ad27978c3b38746278136d0627.jpg', '{\"behavior\":3,\"destination\":\"Hills\",\"destination_meta\":{\"personality\":\"The Nature Enthusiast: Values peace, elevation, and the refreshing spirit of scenic mountain adventures.\",\"scene\":\"A cinematic winding hill road through lush green mountains, layered hills in the background, soft morning mist, pine trees, golden-hour sunlight, clear open road, fresh mountain atmosphere, realistic scenic travel photography, premium cinematic depth, peaceful adventurous riding mood.\"},\"aspiration\":\"Mastery and depth\",\"aspiration_meta\":{\"color\":\"Black\",\"final_color\":\"Racing Blue\"}}', 'For the Nature Enthusiast whose spirit finds unparalleled serenity ascending cinematic mountain vistas, your R15 V4 is the refined conduit to breathtaking elevation and peace. As the vibrant Racing Blue cuts through the golden-hour mist, it propels you into a profound journey of mastery, where every winding road reveals a deeper, more exhilarating connection.', '2026-05-10 06:16:52', '81b4f3ad27978c3b38746278136d0627', 'completed'),
(46, 12, 48, 'https://yamaha-ai-generations-2026.s3.ap-south-1.amazonaws.com/generations/gen_8b97c5da31cbda77aa6e77c98c96e4f0.jpg', '{\"behavior\":13,\"destination\":\"Hills\",\"destination_meta\":{\"personality\":\"The Nature Enthusiast: Values peace, elevation, and the refreshing spirit of scenic mountain adventures.\",\"scene\":\"A cinematic winding hill road through lush green mountains, layered hills in the background, soft morning mist, pine trees, golden-hour sunlight, clear open road, fresh mountain atmosphere, realistic scenic travel photography, premium cinematic depth, peaceful adventurous riding mood.\"},\"aspiration\":\"Balance and intellect\",\"aspiration_meta\":{\"color\":\"Grey\",\"final_color\":\"White\"}}', 'You, the discerning nature enthusiast, navigate life\'s ascents with an innate balance and keen intellect, seeking profound clarity amidst the serene grandeur of mist-kissed mountain roads. The Yamaha XSR, a masterpiece of authentic design and refined performance, is the perfect complement, elevating your journey into a premium, cinematic adventure where peace meets exhilaration.', '2026-05-10 06:28:46', '8b97c5da31cbda77aa6e77c98c96e4f0', 'completed'),
(47, 11, 34, 'https://yamaha-ai-generations-2026.s3.ap-south-1.amazonaws.com/generations/gen_8faf5dfc5042cdd844cd6b81370886fd.jpg', '{\"behavior\":2,\"destination\":\"City Life \",\"destination_meta\":{\"personality\":\"The Modern Urbanite: Driven by sophistication, nightlife energy, and a premium metropolitan identity.\",\"scene\":\"A cinematic modern city night road with a long, clean asphalt street stretching into the distance. Tall glass skyscrapers, glowing LED billboards, and premium shopfronts line both sides. Inspired by a blend of NYC and Singapore. Bright urban streetlights with realistic reflections on the road surface. High-detail realistic environment, premium automotive photography style, cinematic depth.\"},\"aspiration\":\"Vitality and zest\",\"aspiration_meta\":{\"color\":\"Red\",\"final_color\":\"Red\"}}', 'Your discerning spirit, alive with the vitality and zest of the metropolis, flawlessly embodies the premium essence of the Modern Urbanite. Paired with the Yamaha Fazer, every illuminated skyscraper and reflective urban thoroughfare becomes your personal stage, a testament to your commanding presence.', '2026-05-10 06:37:56', '8faf5dfc5042cdd844cd6b81370886fd', 'completed'),
(48, 13, 33, 'https://yamaha-ai-generations-2026.s3.ap-south-1.amazonaws.com/generations/gen_33ce3602b512e36be6fd04bec1783ee3.jpg', '{\"behavior\":1,\"destination\":\"Beaches\",\"destination_meta\":{\"personality\":\"The Serene Traveler: Motivated by freedom, calmness, and the relaxation of scenic coastal experiences.\",\"scene\":\"A serene coastal marine drive road beside a tropical Maldives-style beach. Crystal-clear blue ocean, white sand, palm trees, and luxury beach villas in the background. Soft sunlight with a calm sea breeze mood. Open scenic road, realistic premium travel photography, cinematic composition, peaceful and aspirational atmosphere.\"},\"aspiration\":\"Boundless potential\",\"aspiration_meta\":{\"color\":\"Blue\",\"final_color\":\"Racing Blue\"}}', 'We celebrate the Serene Traveler in you, drawn to the pristine beauty where tranquil coastlines meet an endless, inspiring horizon. This embodies your boundless potential, a vibrant Racing Blue spirit that propels you with effortless dynamism towards every extraordinary aspiration.', '2026-05-10 06:43:21', '33ce3602b512e36be6fd04bec1783ee3', 'completed'),
(49, 14, 33, 'https://yamaha-ai-generations-2026.s3.ap-south-1.amazonaws.com/generations/gen_309ef612332dde705c726ee237738eb2.jpg', '{\"behavior\":1,\"destination\":\"Hills\",\"destination_meta\":{\"personality\":\"The Nature Enthusiast: Values peace, elevation, and the refreshing spirit of scenic mountain adventures.\",\"scene\":\"A cinematic winding hill road through lush green mountains, layered hills in the background, soft morning mist, pine trees, golden-hour sunlight, clear open road, fresh mountain atmosphere, realistic scenic travel photography, premium cinematic depth, peaceful adventurous riding mood.\"},\"aspiration\":\"Total synergy\",\"aspiration_meta\":{\"color\":\"Unified\",\"final_color\":\"Metallic Black\"}}', 'As the nature enthusiast, your spirit truly ascends with the morning mist and golden light, finding total synergy on every breathtaking winding ascent. The Yamaha Aerox155 transforms each journey into a seamless, unified symphony of motion, crafting your premium mountain adventure with unmatched elegance.', '2026-05-10 06:47:18', '309ef612332dde705c726ee237738eb2', 'completed'),
(50, 14, 38, 'https://yamaha-ai-generations-2026.s3.ap-south-1.amazonaws.com/generations/gen_4d0e1bb2f6cce3dcd44ec241781e9ade.jpg', '{\"behavior\":13,\"destination\":\"Hills\",\"destination_meta\":{\"personality\":\"The Nature Enthusiast: Values peace, elevation, and the refreshing spirit of scenic mountain adventures.\",\"scene\":\"A cinematic winding hill road through lush green mountains, layered hills in the background, soft morning mist, pine trees, golden-hour sunlight, clear open road, fresh mountain atmosphere, realistic scenic travel photography, premium cinematic depth, peaceful adventurous riding mood.\"},\"aspiration\":\"Vitality and zest\",\"aspiration_meta\":{\"color\":\"Red\",\"final_color\":\"Majesty Red\"}}', 'For the spirit that yearns for serene elevations, where golden light pierces the morning mist and winding roads promise refreshing discovery, your journey embodies pure vitality. The Yamaha FZS V4 is not merely a machine, but a finely tuned extension of that very spirit, translating every turn into a pulse of pure exhilaration and majestic freedom.', '2026-05-10 06:53:31', '4d0e1bb2f6cce3dcd44ec241781e9ade', 'completed'),
(51, 15, 33, 'https://yamaha-ai-generations-2026.s3.ap-south-1.amazonaws.com/generations/gen_7286f0cfa08fcc65661ef6756c437e86.jpg', '{\"behavior\":15,\"destination\":\"Beaches\",\"destination_meta\":{\"personality\":\"The Serene Traveler: Motivated by freedom, calmness, and the relaxation of scenic coastal experiences.\",\"scene\":\"A serene coastal marine drive road beside a tropical Maldives-style beach. Crystal-clear blue ocean, white sand, palm trees, and luxury beach villas in the background. Soft sunlight with a calm sea breeze mood. Open scenic road, realistic premium travel photography, cinematic composition, peaceful and aspirational atmosphere.\"},\"aspiration\":\"Balance and intellect\",\"aspiration_meta\":{\"color\":\"Grey\",\"final_color\":\"Grey Vermillion\"}}', 'For the discerning spirit who finds profound freedom and tranquility along sun-kissed coastal roads, your journey is an exquisite pursuit of serene luxury. The Yamaha Aerox155 is not merely a ride, but your sophisticated companion, perfectly attuned to your aspiration for balance and intellect with every effortless, scenic mile.', '2026-05-10 07:28:16', '7286f0cfa08fcc65661ef6756c437e86', 'completed');

-- --------------------------------------------------------

--
-- Table structure for table `option_bike_mappings`
--

CREATE TABLE `option_bike_mappings` (
  `id` int(11) NOT NULL,
  `option_id` int(11) NOT NULL,
  `bike_id` int(11) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `option_bike_mappings`
--

INSERT INTO `option_bike_mappings` (`id`, `option_id`, `bike_id`, `created_at`) VALUES
(17, 1, 39, '2026-05-09 20:40:52'),
(18, 1, 48, '2026-05-09 20:40:52'),
(19, 1, 38, '2026-05-09 20:40:52'),
(20, 1, 49, '2026-05-09 20:40:52'),
(21, 1, 33, '2026-05-09 20:40:52'),
(22, 2, 47, '2026-05-09 20:42:00'),
(23, 2, 45, '2026-05-09 20:42:00'),
(24, 2, 34, '2026-05-09 20:42:00'),
(25, 2, 46, '2026-05-09 20:42:00'),
(26, 2, 36, '2026-05-09 20:42:00'),
(27, 3, 43, '2026-05-09 20:42:53'),
(28, 3, 42, '2026-05-09 20:42:53'),
(29, 3, 44, '2026-05-09 20:42:53'),
(30, 3, 50, '2026-05-09 20:42:53'),
(31, 3, 41, '2026-05-09 20:42:53'),
(32, 11, 43, '2026-05-09 20:43:37'),
(33, 11, 44, '2026-05-09 20:43:37'),
(34, 11, 50, '2026-05-09 20:43:37'),
(35, 11, 40, '2026-05-09 20:43:37'),
(36, 11, 41, '2026-05-09 20:43:37'),
(37, 12, 41, '2026-05-09 20:44:08'),
(38, 12, 40, '2026-05-09 20:44:08'),
(39, 12, 35, '2026-05-09 20:44:08'),
(40, 12, 37, '2026-05-09 20:44:08'),
(41, 12, 38, '2026-05-09 20:44:08'),
(45, 14, 48, '2026-05-09 20:45:20'),
(46, 14, 39, '2026-05-09 20:45:20'),
(47, 14, 35, '2026-05-09 20:45:20'),
(48, 13, 39, '2026-05-09 20:45:43'),
(49, 13, 48, '2026-05-09 20:45:43'),
(50, 13, 35, '2026-05-09 20:45:43'),
(51, 13, 34, '2026-05-09 20:45:43'),
(52, 13, 38, '2026-05-09 20:45:43'),
(53, 15, 33, '2026-05-09 20:46:07'),
(54, 15, 46, '2026-05-09 20:46:07'),
(55, 15, 45, '2026-05-09 20:46:07'),
(56, 15, 39, '2026-05-09 20:46:07'),
(57, 15, 48, '2026-05-09 20:46:07');

-- --------------------------------------------------------

--
-- Table structure for table `otps`
--

CREATE TABLE `otps` (
  `id` int(11) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `otp_code` varchar(10) NOT NULL,
  `expires_at` datetime NOT NULL,
  `is_used` tinyint(1) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `otps`
--

INSERT INTO `otps` (`id`, `phone`, `otp_code`, `expires_at`, `is_used`, `created_at`) VALUES
(11, '01787079010', '4644', '2026-04-28 05:02:07', 1, '2026-04-28 04:57:07'),
(12, '01787079010', '5214', '2026-04-28 05:14:32', 0, '2026-04-28 05:09:32'),
(13, '01787079010', '7279', '2026-04-28 05:16:39', 1, '2026-04-28 05:11:39'),
(14, '01609041569', '1579', '2026-04-28 05:17:43', 0, '2026-04-28 05:12:43'),
(15, '01609041569', '5712', '2026-04-28 05:19:24', 0, '2026-04-28 05:14:24'),
(16, '01609041569', '8180', '2026-04-28 05:22:11', 0, '2026-04-28 05:17:11'),
(17, '01609041569', '6952', '2026-04-28 05:23:21', 1, '2026-04-28 05:18:21'),
(18, '01787079010', '3597', '2026-04-28 05:30:48', 1, '2026-04-28 05:25:48'),
(19, '01787079010', '7322', '2026-04-28 06:00:04', 1, '2026-04-28 05:55:04'),
(20, '01609041569', '5273', '2026-04-28 06:46:24', 1, '2026-04-28 06:41:24'),
(21, '01787079010', '9450', '2026-04-28 06:46:57', 1, '2026-04-28 06:41:57'),
(22, '01787079010', '1419', '2026-04-28 15:31:08', 1, '2026-04-28 15:26:08'),
(23, '01787079010', '7476', '2026-04-28 16:02:05', 1, '2026-04-28 15:57:05'),
(24, '0160904156', '9903', '2026-04-28 16:02:55', 0, '2026-04-28 15:57:55'),
(25, '01609041569', '5738', '2026-04-28 16:03:02', 1, '2026-04-28 15:58:02'),
(26, '01609041569', '1532', '2026-04-28 16:47:19', 1, '2026-04-28 16:42:19'),
(27, '01787079010', '6936', '2026-04-28 21:00:41', 0, '2026-04-29 02:55:41'),
(28, '01787079010', '9954', '2026-05-02 22:26:00', 1, '2026-05-02 22:21:00'),
(29, '01787079010', '6363', '2026-05-05 14:17:47', 1, '2026-05-05 14:12:47'),
(30, '01787079010', '5665', '2026-05-05 15:16:24', 1, '2026-05-05 15:11:24'),
(31, '01609041569', '5150', '2026-05-05 15:23:25', 1, '2026-05-05 15:18:25'),
(32, '01787079010', '4317', '2026-05-06 01:10:07', 1, '2026-05-06 01:05:07'),
(33, '01609041569', '8619', '2026-05-06 01:18:37', 1, '2026-05-06 01:13:37'),
(34, '01609041569', '1724', '2026-05-06 02:02:13', 0, '2026-05-06 01:57:13'),
(35, '01609041569', '4617', '2026-05-06 02:03:22', 1, '2026-05-06 01:58:22'),
(36, '01787079010', '8744', '2026-05-07 13:40:59', 1, '2026-05-07 13:35:59'),
(37, '01609041569', '4050', '2026-05-07 13:47:07', 1, '2026-05-07 13:42:07'),
(38, '01787079010', '1391', '2026-05-07 13:51:47', 1, '2026-05-07 13:46:47'),
(39, '01787079010', '1675', '2026-05-07 16:19:26', 1, '2026-05-07 16:14:26'),
(40, '01787079010', '9314', '2026-05-07 16:29:54', 1, '2026-05-07 16:24:54'),
(41, '01787079010', '2452', '2026-05-08 17:56:20', 1, '2026-05-08 17:51:20'),
(42, '01787079010', '2770', '2026-05-09 20:18:13', 1, '2026-05-09 20:13:13'),
(43, '01757647319', '7137', '2026-05-09 17:04:31', 1, '2026-05-09 16:59:31'),
(44, '01757647319', '2412', '2026-05-09 18:41:19', 1, '2026-05-09 18:36:19'),
(45, '01757647319', '8880', '2026-05-09 18:50:07', 1, '2026-05-09 18:45:07'),
(46, '01303477962', '2146', '2026-05-09 19:00:48', 1, '2026-05-09 18:55:48'),
(47, '01757647319', '9371', '2026-05-09 19:02:59', 1, '2026-05-09 18:57:59'),
(48, '01757647319', '8140', '2026-05-09 19:18:39', 1, '2026-05-09 19:13:39'),
(49, '01303477962', '8401', '2026-05-09 19:25:57', 1, '2026-05-09 19:20:57'),
(50, '01757647319', '9244', '2026-05-09 21:02:42', 1, '2026-05-09 20:57:42'),
(51, '01757647319', '6263', '2026-05-09 21:38:57', 1, '2026-05-09 21:33:57'),
(52, '01783681420', '4603', '2026-05-09 21:48:55', 0, '2026-05-09 21:43:55'),
(53, '01757647319', '2398', '2026-05-09 21:52:17', 1, '2026-05-09 21:47:17'),
(54, '01734701268', '7424', '2026-05-09 21:54:35', 1, '2026-05-09 21:49:35'),
(55, '01783681429', '9163', '2026-05-09 21:56:42', 1, '2026-05-09 21:51:42'),
(56, '01783681429', '9673', '2026-05-09 22:04:05', 1, '2026-05-09 21:59:05'),
(57, '01757647319', '3193', '2026-05-09 22:12:13', 1, '2026-05-09 22:07:13'),
(58, '01535763995', '3327', '2026-05-09 22:17:48', 1, '2026-05-09 22:12:48'),
(59, '01535763995', '6986', '2026-05-09 22:21:54', 1, '2026-05-09 22:16:54'),
(60, '01303477962', '3764', '2026-05-10 05:51:19', 1, '2026-05-10 05:46:19'),
(61, '01313051684', '4887', '2026-05-10 06:20:15', 1, '2026-05-10 06:15:15'),
(62, '01335262550', '7879', '2026-05-10 06:24:53', 0, '2026-05-10 06:19:53'),
(63, '01580533464', '4126', '2026-05-10 06:30:08', 1, '2026-05-10 06:25:08'),
(64, '01335262550', '8230', '2026-05-10 06:30:19', 0, '2026-05-10 06:25:19'),
(65, '01335161550', '3770', '2026-05-10 06:30:30', 1, '2026-05-10 06:25:30'),
(66, '01313051529', '9509', '2026-05-10 06:42:42', 1, '2026-05-10 06:37:42'),
(67, '01679209771', '1783', '2026-05-10 06:49:13', 1, '2026-05-10 06:44:13'),
(68, '01679209771', '4392', '2026-05-10 06:54:15', 1, '2026-05-10 06:49:15'),
(69, '01872170607', '1724', '2026-05-10 07:12:00', 1, '2026-05-10 07:07:00');

-- --------------------------------------------------------

--
-- Table structure for table `prompts`
--

CREATE TABLE `prompts` (
  `id` int(11) NOT NULL,
  `prompt_template` text NOT NULL,
  `is_active` tinyint(1) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `quiz_options`
--

CREATE TABLE `quiz_options` (
  `id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `option_text` varchar(255) NOT NULL,
  `option_desc` text DEFAULT NULL,
  `icon_name` varchar(100) DEFAULT NULL,
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`)),
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `quiz_options`
--

INSERT INTO `quiz_options` (`id`, `question_id`, `option_text`, `option_desc`, `icon_name`, `metadata`, `created_at`) VALUES
(1, 1, 'Weekend Explorer', 'Long journeys discovering new horizons.', 'Weekend Explorer', '{}', '2026-05-06 01:38:43'),
(2, 1, 'Daily Commuter', 'Navigating the city with efficiency and style.', 'Daily Commuter', '{}', '2026-05-06 01:38:43'),
(3, 1, 'Speed Enthusiast', 'Thrilling performance and high-speed control.', 'Speed Enthusiast', '{}', '2026-05-06 01:38:43'),
(4, 2, 'City Life ', 'A high-speed, sophisticated journey through the heart of a vibrant night-time metropolis.', 'urban-skyline', '{\"personality\":\"The Modern Urbanite: Driven by sophistication, nightlife energy, and a premium metropolitan identity.\",\"scene\":\"A cinematic modern city night road with a long, clean asphalt street stretching into the distance. Tall glass skyscrapers, glowing LED billboards, and premium shopfronts line both sides. Inspired by a blend of NYC and Singapore. Bright urban streetlights with realistic reflections on the road surface. High-detail realistic environment, premium automotive photography style, cinematic depth.\"}', '2026-05-06 01:38:43'),
(5, 2, 'Beaches', 'A peaceful coastal ride beside crystal-clear blue waters, soft white sands, and luxury tropical villas.', 'beach-palm', '{\"personality\":\"The Serene Traveler: Motivated by freedom, calmness, and the relaxation of scenic coastal experiences.\",\"scene\":\"A serene coastal marine drive road beside a tropical Maldives-style beach. Crystal-clear blue ocean, white sand, palm trees, and luxury beach villas in the background. Soft sunlight with a calm sea breeze mood. Open scenic road, realistic premium travel photography, cinematic composition, peaceful and aspirational atmosphere.\"}', '2026-05-06 01:38:43'),
(7, 3, 'Boundless potential', 'A calm, expansive explorer who mirrors the limitless depth of the ocean and the sky.', 'Iconic Blue', '{\"color\":\"Blue\"}', '2026-05-06 01:38:43'),
(8, 3, 'Vitality and zest', 'A bold, energetic leader who ignites every journey with passion and a courageous heart.', 'red', '{\"color\":\"Red\"}', '2026-05-06 01:38:43'),
(9, 3, 'Balance and intellect', 'A versatile and wise navigator who masters technical precision and adapts gracefully to any path.', 'grey', '{\"color\":\"Grey\"}', '2026-05-06 01:38:43'),
(11, 1, 'Speed Star', 'Fast roads, quick pickup, and sporty control for riders who love speed.', 'Speed Star', '{}', '2026-05-07 16:23:11'),
(12, 1, 'City Racer', 'City traffic, short rides, and stylish daily movement with smooth handling.', 'City Racer', '{}', '2026-05-07 16:23:32'),
(13, 1, 'Mountain Trekker', 'Hill roads, long climbs, and rough turns with strong balance and power.', 'Mountain Trekker', '{}', '2026-05-07 16:23:57'),
(14, 1, 'Off Road Ruler', 'Dusty roads, village tracks, and broken paths with confident riding.', 'Off Road Ruler', '{}', '2026-05-07 16:24:19'),
(15, 1, 'Beach Rider', 'Coastal roads, relaxed cruising, and sunset rides with comfort and style.', 'Beach Rider', '{}', '2026-05-07 16:24:41'),
(16, 2, 'Hills', 'A peaceful, winding journey through lush green mountains, fresh air, and golden-hour mist.', 'mountain-path', '{\"personality\":\"The Nature Enthusiast: Values peace, elevation, and the refreshing spirit of scenic mountain adventures.\",\"scene\":\"A cinematic winding hill road through lush green mountains, layered hills in the background, soft morning mist, pine trees, golden-hour sunlight, clear open road, fresh mountain atmosphere, realistic scenic travel photography, premium cinematic depth, peaceful adventurous riding mood.\"}', '2026-05-08 17:40:32'),
(17, 2, 'Off-Roads', 'A raw and challenging adventure across uneven dirt roads, rocky terrains, and dust-filled trails.', 'dirt-trail', '{\"personality\":\"The Adventurous Trailblazer: Defined by toughness, exploration, and a passion for raw riding energy.\",\"scene\":\"A cinematic off-road racing trail, uneven dirt road, rocky terrain, dust particles, rugged hills and mountains in the background, dramatic wide sky, adventurous riding atmosphere, premium realistic outdoor photography, powerful off-road mood, high-detail terrain, cinematic action-ready composition.\"}', '2026-05-08 17:42:31'),
(19, 3, 'Mastery and depth', 'A disciplined and sophisticated presence who embodies timeless strength and unwavering focus.', 'black', '{\"color\":\"Black\"}', '2026-05-09 19:12:03'),
(20, 3, 'Total synergy', 'A radiant connector who harmonizes all traits into a complete, inclusive, and whole spirit.', 'Unified', '{\"color\":\"Unified\"}', '2026-05-09 19:13:20');

-- --------------------------------------------------------

--
-- Table structure for table `quiz_questions`
--

CREATE TABLE `quiz_questions` (
  `id` int(11) NOT NULL,
  `question_text` text NOT NULL,
  `question_type` enum('behavior','destination','aspiration') NOT NULL,
  `order_index` int(11) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `quiz_questions`
--

INSERT INTO `quiz_questions` (`id`, `question_text`, `question_type`, `order_index`, `created_at`) VALUES
(1, 'How would you describe your riding behavior?', 'behavior', 1, '2026-05-06 01:38:43'),
(2, 'Choose your favorite riding destination', 'destination', 2, '2026-05-06 01:38:43'),
(3, 'What is your ultimate riding aspiration?', 'aspiration', 3, '2026-05-06 01:38:43');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `dob` varchar(50) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `phone`, `dob`, `created_at`) VALUES
(5, 'Ali Imran Mehedi ', '01757647319', '25-34', '2026-05-09 20:57:54'),
(6, 'Wasifa', '01734701268', '25-34', '2026-05-09 21:49:48'),
(7, 'sajid', '01783681429', '18-24', '2026-05-09 21:52:02'),
(8, 'Alex', '01535763995', '25-34', '2026-05-09 22:13:10'),
(9, 'Efaz Ahmed', '01303477962', '25-34', '2026-05-10 05:46:26'),
(10, 'Nabil', '01313051684', '25-34', '2026-05-10 06:15:30'),
(11, 'Nawfel Ahamad', '01580533464', '25-34', '2026-05-10 06:25:17'),
(12, 'Nasim Shakil', '01335161550', '25-34', '2026-05-10 06:25:46'),
(13, 'SK Mehbub Hassan', '01313051529', '25-34', '2026-05-10 06:37:49'),
(14, 'Apu', '01679209771', '25-34', '2026-05-10 06:44:35'),
(15, 'Sadia ', '01872170607', '18-24', '2026-05-10 07:07:30');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `app_settings`
--
ALTER TABLE `app_settings`
  ADD PRIMARY KEY (`setting_key`);

--
-- Indexes for table `bikes`
--
ALTER TABLE `bikes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `generations`
--
ALTER TABLE `generations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `hash_id` (`hash_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `bike_id` (`bike_id`);

--
-- Indexes for table `option_bike_mappings`
--
ALTER TABLE `option_bike_mappings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `option_id` (`option_id`),
  ADD KEY `bike_id` (`bike_id`);

--
-- Indexes for table `otps`
--
ALTER TABLE `otps`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `prompts`
--
ALTER TABLE `prompts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `quiz_options`
--
ALTER TABLE `quiz_options`
  ADD PRIMARY KEY (`id`),
  ADD KEY `question_id` (`question_id`);

--
-- Indexes for table `quiz_questions`
--
ALTER TABLE `quiz_questions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `phone` (`phone`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bikes`
--
ALTER TABLE `bikes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT for table `generations`
--
ALTER TABLE `generations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT for table `option_bike_mappings`
--
ALTER TABLE `option_bike_mappings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;

--
-- AUTO_INCREMENT for table `otps`
--
ALTER TABLE `otps`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=70;

--
-- AUTO_INCREMENT for table `prompts`
--
ALTER TABLE `prompts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `quiz_options`
--
ALTER TABLE `quiz_options`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `quiz_questions`
--
ALTER TABLE `quiz_questions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `generations`
--
ALTER TABLE `generations`
  ADD CONSTRAINT `generations_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `generations_ibfk_2` FOREIGN KEY (`bike_id`) REFERENCES `bikes` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `option_bike_mappings`
--
ALTER TABLE `option_bike_mappings`
  ADD CONSTRAINT `option_bike_mappings_ibfk_1` FOREIGN KEY (`option_id`) REFERENCES `quiz_options` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `option_bike_mappings_ibfk_2` FOREIGN KEY (`bike_id`) REFERENCES `bikes` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `quiz_options`
--
ALTER TABLE `quiz_options`
  ADD CONSTRAINT `quiz_options_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `quiz_questions` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
