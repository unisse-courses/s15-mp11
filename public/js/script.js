function toggleBrightness(target) {
  if ($("#myAcc").is(":visible")) {
    document.getElementById("container").style.filter = "brightness(100%)";
    $("#myAcc").hide();
  }
  else if (target == "myAccTag" || target == "myAcc"){
    document.getElementById("container").style.filter = "brightness(30%)";
    $("#myAcc").show();
  }
}

function toggleSearch(target) {
  if (target == "searchBox" || target == "searchBtn") {

  }
  else if ($("#searchForm").is(":visible"))
    $("#searchForm").hide();
  else if (target == "searchIcon")
    $("#searchForm").show();
}

function vote(field, type) {
  if (type == 1) {
    $(field).siblings('.voteType').attr('value', '1');
  }
  else {
    $(field).siblings('.voteType').attr('value', '2');
  }
  $(field).siblings(".upvoteCount").addClass("upvoted");
}

$(document).ready(function() {
    $(".opt").click(function() {
      alert();
    });
    $("#postTitle").change(function() {
      $("#postTitleHolder").val($(this).val());
    });
    $("#postCategory").change(function() {
      var src = 'graphics/resto/' + $(this).children("option:selected").val().toLowerCase() +'.jpg';
      $("#picURL").val(src);
      $("#categoryHolder").val($(this).children("option:selected").val());
      $("#postPicture").attr('src', src)
    });
    $("#customPicture").change(function() {
      var file = $("#customPicture");
      if (file.prop('files') && file.prop('files')[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            $("#postPicture").attr('src', e.target.result)
        }
        reader.readAsDataURL(file.prop('files')[0]);
      }
    });

    $("#customProfilePicture").change(function() {
      var file = $("#customProfilePicture");
      if (file.prop('files') && file.prop('files')[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            $("#profilePicture").attr('src', e.target.result)
        }
        reader.readAsDataURL(file.prop('files')[0]);
      }
    });

    $(".upvoteBtn").click(function() {
      vote(this, 1);
    });
    $(".downvoteBtn").click(function() {
      vote(this, 2);
    });

    $(".editBtn").click(function() {
      $(this).siblings('.editComment').attr('form', 'editCommentForm');
    });

    $(".delBtn").click(function() {
      $(this).siblings('.editComment').attr('form', 'deleteCommentForm');
    });

    $(document).click(function(evt) {
      toggleBrightness(evt.target.id);
      toggleSearch(evt.target.id);
    });

});