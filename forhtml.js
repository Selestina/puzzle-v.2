img = document.getElementById('img');
//lastTime=Date.now();
//$('body').mousemove(function(e) {
//  var currentTime = Date.now();
//  if (currentTime - lastTime > 30) {
//    lastTime = currentTime;
//    document.getElementById('background').style.backgroundPosition = (e.pageX * -1 / 4) + 'px ' + (e.pageY * -1 / 4) + 'px';
//  }
//});
$("#rows").slider({value:8, min: 4, max: 12, step: 1});
$("#cols").slider({value:8, min: 4, max: 12, step: 1});
$("#congratulation").hide();
function start(file) {
  $('#settings').hide();
  t1 = new Date();
  $('.piece').remove();
  $('.solved').remove();
  $('#img').removeAttr('height');
  reader = new FileReader();
  reader.readAsDataURL(file[0]);
  reader.onload = function(e) {
    img.src=e.target.result;
    img.onload=function() { 
      zIndex=3;
      //rows = document.getElementById('rows').value;
      //cols = document.getElementById('cols').value;
      rows= $('#rows').slider('value');
      cols= $('#cols').slider('value');
      (document.getElementById('rotation').checked) ? isRotate = true : isRotate = false;    
      rowsHeight = (img.height/rows);
      colsWidth = (img.width/cols);
    //rowsHeight = Math.round(img.height/rows);
    //colsWidth = Math.round(img.width/cols);
      for(i=1; i<=rows; i++){
        for(j=1; j<=cols; j++){
          piece = document.createElement('canvas');
          piece.id = 'piece'+i+'_'+j;
          piece.className='piece';
          //случайное положение кусочка в пределах картинки
          piece.style.top=Math.round(0.7*screen.height*Math.random())+'px';
          piece.style.left=Math.round(0.8*screen.width*Math.random())+'px';
          piece.width=colsWidth;
          piece.height=rowsHeight;
          piece.style.zIndex=2;
          piecectx=piece.getContext('2d');
          piecectx.drawImage(img, (j-1)*colsWidth, (i-1)*rowsHeight, colsWidth, rowsHeight, 0, 0, colsWidth, rowsHeight);
          document.getElementById('game').appendChild(piece);
          $('#piece'+i+'_'+j).data({'x':j-1,'y':i-1, angle:0}); //в куски записываем информацию об их "координатах"
          if (isRotate){
            angle=Math.floor(5*Math.random())%3*90;
            piece.style.transform='rotate('+angle+'deg)';
            //записать угол в переменную angle у кусочка;
            $(this).data('angle',angle);    
          }
        }
      }
      //уменьшение изображения и кусочков
      img.height=$('#background').height();
      rowsHeight = Math.round(img.height/rows);
      colsWidth = Math.round(img.width/cols);
      $('.piece').css('width',colsWidth);
      //Перетаскивание
      $('.piece').draggable({});
      //подъём кусочка при нажатии
      $('.piece').mousedown(function(){
        if (!$(this).hasClass('piece')) return;
          $(this).css('z-index',zIndex); 
        zIndex++;
      });
      $('.piece').mouseup(function(){
        if (!$(this).hasClass('piece')) return;
          if ((Math.abs($(this).data('x')*colsWidth-$(this).position().left)<=3) && (Math.abs($(this).data('y')*rowsHeight-$(this).position().top)<=3) && ($(this).data('angle')%360==0)){
              $(this).draggable('disable');
              $(this).css({'top':$(this).data('y')*rowsHeight, 'left':$(this).data('x')*colsWidth,'z-index':1});
          $(this).removeClass('piece').addClass('solved'); //для удаления и присовения класса
      }
        //для условия решения
       if ($('.solved').length==rows*cols){
        t2 = new Date();
        Time = 0;
        Count = 0;
        t = Math.round((t2-t1)*1000)/1000000;
         // Статистика (общее время, сумма кол-ва кусков)
        if ($.cookie('statistics')!=null){
           Time=parseFloat($.cookie('statistics').split('|')[0]);
           Count=parseInt($.cookie('statistics').split('|')[1]);
           Time+=t;
           Count+=rows*cols;
           $.cookie('statistics', (Time+'|'+Count),{
           expires: 1000*360,
           path: '/',
           });
         }
          if ($.cookie('statistics')==null){ 
            $.cookie('statistics', (t+'|'+(rows*cols)), {
            expires: 1000*360,
            path: '/',
            });
          }
        $('#game').hide();
        $("#congratulation").show();
        $.ajax({url: "record.php", data:{'count':rows*cols}, async: false, success: function(response){$('#RecordContainer').html(response);}});
        document.getElementById('puzPiece').value = rows*cols;
        document.getElementById('mintime').value = (t/60)-((t/60)%1);
        document.getElementById('sectime').value = (t-(Math.floor(t/60))*60);
      }
    });
      //поворот по щелчку
    $('.piece').click(function(){
      if (!$(this).hasClass('piece')) return;
      if (!(isRotate)) return;  
       $(this).data('angle',$(this).data('angle')+90);
      $(this).css('transform','rotate('+$(this).data('angle')+'deg)');
    })
      };
}
}
//новая игра
function restart(){
  $("#congratulation").hide();
  $('.piece').remove();
  $('.solved').remove();
  $('#img').removeAttr('height');
  $('#settings').show();
  $('#game').show();
  $("#sendRecord").show();
}
//отправка рекорда
function send(){
  //request = {'name':$('#Name').val(),'count':rows*cols,'time':t};
  //request.name.push();
  //request.count.push();
  //request.time.push();
  $.ajax({url: "newrecord.php", data:{'name':$('#Name').val(),'count':rows*cols,'time':t}, async:true, success: function(hide){$("#sendRecord").hide();}});
}