-- MySQL dump 10.13  Distrib 8.0.31, for Win64 (x86_64)
--
-- Host: localhost    Database: workout-planner
-- ------------------------------------------------------
-- Server version	8.0.31

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `exercises`
--

DROP TABLE IF EXISTS `exercises`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exercises` (
  `exercise_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`exercise_id`),
  UNIQUE KEY `id` (`exercise_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `exercises_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=298 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exercises`
--

LOCK TABLES `exercises` WRITE;
/*!40000 ALTER TABLE `exercises` DISABLE KEYS */;
INSERT INTO `exercises` VALUES (295,59,'Swings','','images\\2023-02-01T14-45-58.192Z-swings.jpeg'),(296,59,'Turkish get up','','images\\2023-02-01T14-46-06.416Z-turkish-get-up.jpeg'),(297,59,'Clean & Press','','images\\2023-02-02T15-10-53.973Z-clean.jpeg');
/*!40000 ALTER TABLE `exercises` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `routines`
--

DROP TABLE IF EXISTS `routines`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `routines` (
  `routine_id` int NOT NULL AUTO_INCREMENT,
  `workout_id` int NOT NULL,
  `exercise_id` int NOT NULL,
  `sets` int NOT NULL,
  `time_or_repetitions` bit(1) DEFAULT b'0',
  `set_time` int DEFAULT NULL,
  `repetitions` int DEFAULT NULL,
  `rest_time` int NOT NULL DEFAULT '0',
  `break_after_routine` int DEFAULT NULL,
  `order_in_workout` int NOT NULL,
  PRIMARY KEY (`routine_id`),
  UNIQUE KEY `uc_workout_order` (`workout_id`,`order_in_workout`),
  KEY `exercise_id` (`exercise_id`),
  CONSTRAINT `routines_ibfk_1` FOREIGN KEY (`exercise_id`) REFERENCES `exercises` (`exercise_id`),
  CONSTRAINT `routines_ibfk_2` FOREIGN KEY (`workout_id`) REFERENCES `workouts` (`workout_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `routines`
--

LOCK TABLES `routines` WRITE;
/*!40000 ALTER TABLE `routines` DISABLE KEYS */;
INSERT INTO `routines` VALUES (1,414,295,8,_binary '',20,10,10,60,0),(2,414,296,5,_binary '',60,10,0,60,1),(3,414,297,4,_binary '',60,10,0,0,2);
/*!40000 ALTER TABLE `routines` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `user_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` char(255) NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `id` (`user_id`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (59,'nitsan','nitsan447@gmail.com','$2a$12$jgpj0PAh8BHRTuXQ1ynjGOyeA6HbS9L1yRn2lCgOONHIldzCN9r6.');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `workouts`
--

DROP TABLE IF EXISTS `workouts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `workouts` (
  `workout_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text,
  `image` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`workout_id`),
  UNIQUE KEY `id` (`workout_id`),
  UNIQUE KEY `uc_name_user_id` (`name`,`user_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `workouts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=416 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `workouts`
--

LOCK TABLES `workouts` WRITE;
/*!40000 ALTER TABLE `workouts` DISABLE KEYS */;
INSERT INTO `workouts` VALUES (414,59,'Simple and sinister with c&p','','images\\2023-02-01T14-45-50.564Z-swings.jpeg');
/*!40000 ALTER TABLE `workouts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'workout-planner'
--
/*!50003 DROP PROCEDURE IF EXISTS `add_exercise_if_does_not_exist` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `add_exercise_if_does_not_exist`(
IN user_id INT,
IN name VARCHAR(255),
IN description TEXT,
IN image LONGBLOB,
OUT exercise_id INT)
BEGIN
	SELECT exercises.exercise_id FROM exercises WHERE exercises.user_id = user_id AND exercises.name = name INTO exercise_id;
	IF exercise_id IS NULL THEN
	INSERT INTO exercises (exercises.user_id, exercises.name, exercises.description, exercises.image) VALUES (user_id, name, description, image);
    SELECT LAST_INSERT_ID() INTO exercise_id;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `add_routine` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `add_routine`(
IN user_id INT,
IN name VARCHAR(255),
IN description TEXT,
IN image LONGBLOB,
IN workout_id INT,
IN sets INT,
IN time_or_repetitions BIT(1),
IN set_time INT,
IN repetitions INT,
IN rest_time INT,
IN break_after_routine INT,
IN order_in_workout INT)
BEGIN
	DECLARE exercise_id INT;
	CALL add_exercise_if_does_not_exist(user_id, name, description, image, exercise_id);
	INSERT INTO routines (routines.workout_id, routines.exercise_id, routines.sets, routines.time_or_repetitions, 
    routines.set_time, routines.repetitions, routines.rest_time, routines.break_after_routine, routines.order_in_workout)
    VALUES (workout_id, exercise_id, sets, time_or_repetitions, set_time, repetitions, rest_time, break_after_routine, order_in_workout);
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `delete_exercise_if_in_no_workouts` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `delete_exercise_if_in_no_workouts`(
IN exercise_id INT
)
BEGIN
    IF (SELECT COUNT(*) FROM routines WHERE routines.exercise_id = exercise_id) = 0 THEN
    DELETE FROM exercises WHERE exercises.exercise_id = exercise_id; END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `delete_routine` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `delete_routine`(
IN workout_id INT,
IN order_in_workout INT)
BEGIN
	Declare exercise_id INT;
    
    SELECT routines.exercise_id FROM routines WHERE routines.workout_id = workout_id
    AND routines.order_in_workout = order_in_workout INTO exercise_id;
    
    DELETE FROM routines WHERE routines.workout_id = workout_id
    AND routines.order_in_workout = order_in_workout;
    
    CALL delete_exercise_if_in_no_workouts(exercise_id);
    
    UPDATE routines SET routines.order_in_workout = routines.order_in_workout - 1
	WHERE routines.workout_id = workout_id AND routines.order_in_workout > order_in_workout;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `delete_workout` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `delete_workout`(
IN workout_id INT)
BEGIN
	DECLARE number_of_routines INT;
    DECLARE current_routine INT;
    
    SET current_routine = 0;
    delete_routines: LOOP
		SELECT COUNT(*) FROM routines INNER JOIN exercises ON routines.exercise_id=exercises.exercise_id 
		WHERE routines.workout_id=workout_id INTO number_of_routines;
		IF number_of_routines=0 THEN
			LEAVE delete_routines;
		END IF;
        call delete_routine(workout_id, current_routine);
	END LOOP;
    DELETE FROM workouts WHERE workouts.workout_id = workout_id;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `edit_routine` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `edit_routine`(
IN user_id INT,
IN name VARCHAR(255),
IN description TEXT,
IN image LONGBLOB,
IN workout_id INT,
IN sets INT,
IN time_or_repetitions BIT(1),
IN set_time INT,
IN repetitions INT,
IN rest_time INT,
IN break_after_routine INT,
IN order_in_workout INT)
BEGIN
	CALL edit_exercise(user_id, name, description, image);
    Update exercises SET exercises.name=name, exercises.description=description, exercises.image=image
    WHERE exercises.name=name AND exercises.user_id=user_id;
    
	UPDATE routines SET routines.workout_id=workout_id, routines.sets=sets,
    routines.time_or_repetitions=time_or_repetitions, routines.set_time=set_time, routines.repetitions=repetitions,
    routines.rest_time=rest_time, routines.break_after_routine=break_after_routine, routines.order_in_workout=order_in_workout
    WHERE routines.workout_id=workout_id AND routines.order_in_workout=order_in_workout;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `update_routine` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `update_routine`(
IN user_id INT,
IN name VARCHAR(255),
IN description TEXT,
IN image LONGBLOB,
IN workout_id INT,
IN sets INT,
IN time_or_repetitions BIT(1),
IN set_time INT,
IN repetitions INT,
IN rest_time INT,
IN break_after_routine INT,
IN order_in_workout INT)
BEGIN
	DECLARE exercise_id INT;
	SELECT routines.exercise_id FROM routines WHERE routines.workout_id = workout_id AND routines.order_in_workout = order_in_workout INTO exercise_id;
    
    UPDATE exercises SET exercises.name=name, exercises.description=description, exercises.image=image
    WHERE exercises.exercise_id=exercise_id AND exercises.user_id=user_id;
    
	UPDATE routines SET routines.workout_id=workout_id, routines.sets=sets,
    routines.time_or_repetitions=time_or_repetitions, routines.set_time=set_time, routines.repetitions=repetitions,
    routines.rest_time=rest_time, routines.break_after_routine=break_after_routine, routines.order_in_workout=order_in_workout
    WHERE routines.workout_id=workout_id AND routines.order_in_workout=order_in_workout;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `update_routines_order` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE PROCEDURE `update_routines_order`(
IN workout_id INT,
IN old_routine_index INT,
IN new_routine_index INT
)
BEGIN
	DECLARE current_routine_index INT;
    DECLARE direction INT;
    SET current_routine_index = old_routine_index;
    IF (old_routine_index > new_routine_index) THEN
		SET direction = -1;
	ELSE
		SET direction = 1;
	END IF;
    UPDATE routines SET order_in_workout = (-1) 
	WHERE routines.workout_id = workout_id and order_in_workout = old_routine_index;
    
    update_routines_order: LOOP
		SET current_routine_index = current_routine_index + direction;
		IF (current_routine_index>new_routine_index AND direction=1) OR (current_routine_index<new_routine_index AND direction=-1) THEN
			LEAVE update_routines_order;
		END IF;
        UPDATE routines SET order_in_workout = (current_routine_index - direction) 
        WHERE routines.workout_id = workout_id and order_in_workout = current_routine_index;
	END LOOP;
    
	UPDATE routines SET order_in_workout = (new_routine_index) 
	WHERE routines.workout_id = workout_id and order_in_workout = -1;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-02-04 17:49:12
