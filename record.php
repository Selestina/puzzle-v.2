<?php 
  $count = $_REQUEST['count'];
  mysql_select_db('gb_x_sober40c', mysql_connect('mysql87.1gb.ru', 'gb_x_sober40c', '2ac2bc2e45'));
  $query = mysql_query("SELECT Name, Time FROM Record WHERE Count =".$count." ORDER BY Time LIMIT 10");
  $record.="<div style='width:50%; text-align:center'>Имя</div><div style='width:50%; text-align:center'>Время</div>";
  while($row=mysql_fetch_array($query)) {
    $record.="<div style='width:50%; text-align:center'>".$row[0]."</div><div style='width:50%; text-align:center'>".$row[1]."</div>";
  }
  echo($record);
?>