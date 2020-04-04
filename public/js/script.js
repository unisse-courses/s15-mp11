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

function postFeatureToggle() {
  $("#replyBox").toggle();
  switchLogin();
  if ($(".upvoteBtn").attr('class') == 'btn mx-1 upvoteBtn btn-disabled') {
    $('.upvoteBtn').removeClass('btn-disabled');
    $('.downvoteBtn').removeClass('btn-disabled');
  }
  else {
    $('.upvoteBtn').addClass('btn-disabled');
    $('.downvoteBtn').removeClass('btn-disabled');
  }
}

function switchFeatures() {
  if (document.getElementById("createPost")) {
    if (document.getElementById("createPost").style.display == 'block') {
      document.getElementById("createPost").style.display = 'none';
      switchLogin();
    }
    else {
      document.getElementById("createPost").style.display = 'block';
      switchLogin();
    }
  }

  else {
    if (document.getElementById("replyBox").style.display == 'block') {
      postFeatureToggle();
    }
    else {
      postFeatureToggle();
    }
  }
}

function vote(field, type) {
  var count = $(field).siblings(".upvoteCount").text();
  if (type == 1) {
    count++;
    $(field).hide();
    $(field).siblings(".downvoteBtn").hide();
  }
  else {
    count--;
    $(field).hide();
    $(field).siblings(".upvoteBtn").hide();
  }

  $(field).siblings("#upvoteCount").html(count);
  $(field).siblings(".upvoteCount").addClass("upvoted");
}

$(document).ready(function() {
    $(".reportBtn").click(function() {
      var string = $(this).parents(".userContainer").children(".postID").val();
      alert(string);
    });

    $(".quoteBtn").click(function() {
      var text = $(this).parent().siblings(".userMessage").text();
      text = text.replace(/(\r\n|\n|\r)/gm, "");
      text = text.replace(/\s+/g," ");
      document.getElementById("ta").value = text;
    });

    $(".upvoteBtn").click(function() {
      vote(this, 1);
    });
    $(".downvoteBtn").click(function() {
      vote(this, 2);
    });

    $("#createPost").click(function() {

    });

    $("#postBtn").click(function() {

    });

    $(document).click(function(evt) {
      toggleBrightness(evt.target.id);
      toggleSearch(evt.target.id);
    });

});