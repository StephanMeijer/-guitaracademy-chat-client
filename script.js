function sendMessage(msg, callback) {
  var encoded_msg = encodeURIComponent(JSON.stringify(msg));

  $.ajax({
    method: "GET",
    url: "api.php?request_answer=" + encoded_msg
  }).done(callback);
}

function insertMessage(side) {
  return function(msg) {
    msg = msg.trim();
    $('<div class="msg_'+side+'">'+msg+'</div>').insertBefore('.msg_push');
    $('.msg_body').scrollTop($('.msg_body')[0].scrollHeight);
  };
}

var insertMessageA = insertMessage('a');
var insertMessageB = insertMessage('b');

function initialise(name) {
  $('.msg_wrap').slideToggle('slow', function() {
    $('.msg_start').html('<div class="msg_body"><div class="msg_push"></div></div><div class="msg_footer"><textarea class="msg_input" rows="4"></textarea>');

    $('.msg_wrap').slideToggle();
    
    sendMessage({
      _first: true,
      contact: {
        name: name
      }
    }, function(response) {
      insertMessageA(response.trim());
    });

    $('.msg_wrap textarea').keypress(function(e){
      if (e.keyCode == 13) {
        var msg = $(this).val();

        $(this).val('');

        if (msg.trim() != '') {
          insertMessageB(msg.trim());
          sendMessage({
            message: msg.trim(),
            contact: {
              name: name
            }
          }, function(response) {
            insertMessageA(response.trim());
          });
        }
      }
    });
  });
}

function checkFullName() {
  var name = $('.msg_start input[name=name]').val().trim();

  if (name.indexOf(' ') > -1) {
    initialise(name);
  } else {
    $.growl.error({
      title: 'Fout!',
      message: 'Gelieve uw volledig naam in te vullen.'
    });
  }
}

$(document).ready(function(){
  $('.msg_wrap .msg_start button').click(checkFullName);

  $('.msg_wrap .msg_start input[name=name]').keypress(function(e){
    if (e.keyCode == 13) {
      checkFullName();
    }
  });

  $('.chat_head').click(function(){
    $('.chat_body').slideToggle('slow');
  });

  $('.msg_head').click(function(){
    $('.msg_wrap').slideToggle('slow');
  });

  $('.close').click(function(){
    $('.msg_box').hide();
  });

  $('.user').click(function(){
    $('.msg_wrap').show();
    $('.msg_box').show();
  });
});
