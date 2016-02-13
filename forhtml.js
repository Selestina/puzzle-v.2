img = document.getElementById('img');
//lastTime=Date.now();
//$('body').mousemove(function(e) {
//  var currentTime = Date.now();
//  if (currentTime - lastTime > 30) {
//    lastTime = currentTime;
//    document.getElementById('background').style.backgroundPosition = (e.pageX * -1 / 4) + 'px ' + (e.pageY * -1 / 4) + 'px';
//  }
//});
$("#rows").slider({
  value:84,
  min: 12,
  max: 144,
  step: 12,
  slide: function(event,ui){$('#rowscount').html(ui.value)}});
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
      //rows= $('#rows').slider('value');
      if ($('#rows').slider('value')==12){rows=3, cols=4};
      if ($('#rows').slider('value')==24){rows=4, cols=6};
      if ($('#rows').slider('value')==36){rows=4, cols=9};
      if ($('#rows').slider('value')==48){rows=6, cols=8};
      if ($('#rows').slider('value')==60){rows=6, cols=10};
      if ($('#rows').slider('value')==72){rows=6, cols=12};
      if ($('#rows').slider('value')==84){rows=7, cols=12};
      if ($('#rows').slider('value')==96){rows=8, cols=12};
      if ($('#rows').slider('value')==108){rows=9, cols=12};
      if ($('#rows').slider('value')==120){rows=6, cols=20};
      if ($('#rows').slider('value')==132){rows=11, cols=12};
      if ($('#rows').slider('value')==144){rows=12, cols=12};
      //if ($('#rows').slider('value')==160){rows=25, cols=25};
      //cols= $('#cols').slider('value');
      (document.getElementById('rotation').checked) ? isRotate = true : isRotate = false;
      puzzleLogical = ((img.width/cols) < (img.height/rows)) ? img.width/cols : img.height/rows;
      //puzzleLogical = img.width/cols;
      imgHeight = puzzleLogical*rows;  
      imgWidth = puzzleLogical*cols;
      puzzleOffset=puzzleLogical/100*35;
      puzzleSize=puzzleLogical/100*170;
      imgCanvas= document.createElement('canvas');
      imgCanvas.width=imgWidth;
      imgCanvas.height=imgHeight;
      imgCanvasctx=imgCanvas.getContext('2d');
      imgCanvasctx.drawImage(img,0,0,img.width,img.height,0,0,imgWidth,imgHeight);
      $('#img').remove();
      imgCanvas.id="img";
      document.getElementById('image').appendChild(imgCanvas);
      img=document.getElementById("img");
    
    pieceType=randomPieceTypes(rows,cols);
      for(i=1; i<=rows; i++){
        for(j=1; j<=cols; j++){
          piece = document.createElement('canvas');
          piece.id = 'piece'+i+'_'+j;
          piece.className='piece';
          //случайное положение кусочка в пределах картинки
          piece.style.top=Math.round(0.7*screen.height*Math.random())+'px';
          piece.style.left=Math.round(0.8*screen.width*Math.random())+'px';
      mask = document.getElementById(pieceType[i-1][j-1]);
          piece.width=puzzleSize;
          piece.height=puzzleSize;
          piece.style.zIndex=2;
          piecectx=piece.getContext('2d');
      piecectx.drawImage(mask,0,0,puzzleSize, puzzleSize);
      piecectx.globalCompositeOperation='source-in';
          piecectx.drawImage(img, (j-1)*puzzleLogical-puzzleOffset, (i-1)*puzzleLogical-puzzleOffset, puzzleSize, puzzleSize, 0, 0, puzzleSize, puzzleSize);
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
    $('#img').css('height',$('#background').height());
    if ($('#img').width()>screen.width) {
     $('#img').css('width',screen.width);
     $('#img').css('height','');
    }
      imgleft=0;
    imgtop=0;
      if ($('#img').width()<$('#background').width()){
    imgleft=($('#background').width()-$('#img').width())/2;
    $('#img').css('left',imgleft);
      }
    if ($('#img').height()<$('#background').height()){
    imgtop=($('#background').height()-$('#img').height())/2;
    $('#img').css('top',imgtop);
      }
    puzzleLogical=Math.round($('#img').height()/rows);
    puzzleOffset=puzzleLogical/100*35;
    puzzleSize=puzzleLogical/100*170;
      $('.piece').css('width',puzzleSize);
      //Перетаскивание
      $('.piece').draggable({});
      //подъём кусочка при нажатии
      $('.piece').mousedown(function(e){
    if (!isPiece(this.id,e)) {
      passEventLower(this.id, e);
      return;
    }
        if (!$(this).hasClass('piece')) return;
          $(this).css('z-index',zIndex); 
        zIndex++;
      });
      $('.piece').mouseup(function(){
        if (!$(this).hasClass('piece')) return;
          if ((Math.abs($(this).data('x')*puzzleLogical-$(this).offset().left-$('#game').scrollLeft()-puzzleOffset)<=3+imgleft) && (Math.abs($(this).data('y')*puzzleLogical-$(this).offset().top-$('#game').scrollTop()-puzzleOffset)<=3+imgtop) && ($(this).data('angle')%360==0)){
              $(this).draggable('disable');
              $(this).css({'top':$(this).data('y')*puzzleLogical+imgtop-puzzleOffset, 'left':$(this).data('x')*puzzleLogical+imgleft-puzzleOffset,'z-index':1,'transform':'rotate(0deg)'});
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
  $('#img').remove();
  $('#image').append('<img id="img">');
}
//отправка рекорда
function send(){
  //request = {'name':$('#Name').val(),'count':rows*cols,'time':t};
  //request.name.push();
  //request.count.push();
  //request.time.push();
  $.ajax({url: "newrecord.php", data:{'name':$('#Name').val(),'count':rows*cols,'time':t}, async:true, success: function(hide){$("#sendRecord").hide();}});
}

function isPiece (id,e) {
  var x = e.pageX-$('#'+id).offset().left;
  var y = e.pageY-$('#'+id).offset().top;
  return ((x>puzzleOffset)&&(x<puzzleSize-puzzleOffset)&&(y>puzzleOffset)&&(y<puzzleSize-puzzleOffset)) ? true : false;
}
function passEventLower(id, e) {
  $('#'+id).hide();
    var $el = $(document.elementFromPoint(e.pageX, e.pageY));
  $('#'+id).trigger('mouseup');
    $el.trigger(e);
  $('#'+id).show();
}