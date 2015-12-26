<?php 
  $name = $_REQUEST['name'];
  $count = $_REQUEST['count'];
  $time = $_REQUEST['time'];
  mysql_select_db('gb_x_sober40c', mysql_connect('mysql87.1gb.ru', 'gb_x_sober40c', '2ac2bc2e45'));
  mysql_query("INSERT INTO Record VALUES('".$name."', ".$count.", ".$time.")");
?>