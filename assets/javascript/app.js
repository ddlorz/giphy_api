var gifObject = {
  topics: ["DOG", "CAT", "LION", "KANGAROO", "HYENA", "MONKEY", 
          "SQUIRREL", "GOLDFISH", "GIRAFFE", "SKUNK", "HAMSTER"],
  inputTagArray: [],
  indexCounter: [],

  createNewVid: function(mp4Location) {
    var newVid = $("<video>");
    newVid.attr("loop", "loop");
    newVid.attr("type", "video/mp4");        
    newVid.attr("src", mp4Location);
    newVid.val("notRunning");
    newVid.addClass("embeddedmp4");
    return newVid;
  },

  createNewImg: function(imgLocation) {
    var newImg = $("<img>");
    newImg.attr("src",imgLocation);
    newImg.addClass("animatedImg");
    return newImg;
  },

  createNewDiv: function(ratingLocation) {
    var newDiv = $("<div>");          
    newDiv.addClass("videos");
    newDiv.html("<br>Rating: " + ratingLocation);
    return newDiv;
  },

  createNewBtn: function(inputTag) {
    var newBtn = $("<button>");
    newBtn.addClass("btn btn-default tags");
    newBtn.html(inputTag.toUpperCase());
    return newBtn;
  },

  motionControl: function(theElement) {
    if ($(theElement).val() === "running") {
      $(theElement).get(0).pause();
      $(theElement).animate({
        opacity: 0.5
      }, 1000, function() {});
      $(theElement).val("notRunning")
    } 
    else if ($(theElement).val() === "notRunning"){
      $(theElement).get(0).play();   
      $(theElement).animate({
        opacity: 1.0
      }, 1000, function() {});       
      $(theElement).val("running")
    }
  },

  clearOut: function(event) {
    gifObject.indexCounter = [];    
    $("#gifSide").empty();        
  },

  pullANDdisplayGIFs: function(inputTag) {
    $.ajax({
      url: "https://api.giphy.com/v1/gifs/search?q=" + inputTag + "&api_key=dc6zaTOxFJmzC",
      type: "GET",
      success: function(response) {
        
        if (response.data.length > 0) {
          console.log(response);
          var counter = 0;
          var i = 0;
          while (counter < 10) {
            if (parseInt(response.data[i].images.original.height) < 300) {
              var mp4Location = response.data[i].images.original.mp4;
              var ratingLocation = response.data[i].rating;          
              
              var newDiv = gifObject.createNewDiv(ratingLocation)
              var newVid = gifObject.createNewVid(mp4Location);
              gifObject.indexCounter.push(i);

              newDiv.prepend(newVid);
              $("#gifSide").append(newDiv);    
              counter++;
            }
            i++;                
          }                  
          animatedGIFs(response);          
          
          inputTag = inputTag.toUpperCase();
          if (gifObject.topics.indexOf(inputTag) === -1) {
              var newBtn = gifObject.createNewBtn(inputTag);
              $("#buttonSide").append(newBtn);
              gifObject.topics.push(inputTag);
          }
        }
        else if (response.data.length === 0) {
          $("#gifSide").append("Search Failed. Try Again");
        }
      }
    });
  },

  displayAnimation: function(i, anObject) {
        var imgLocation = anObject.data[gifObject.indexCounter[i]].images.downsized.url;
        //console.log(anObject.data[gifObject.inputTagArray[i]].images.downsized_still.url);
        var newImg = gifObject.createNewImg(imgLocation);

        newImg.css("opacity", "1.0");
        //newImg.css("position", "relative");
        $("#animateSide").html(newImg);
        newImg.animate({
              opacity: 0,
              left: "+=50%"
        }, 10000, function() {}); 
  },

  initialBtnDisplay: function() {
        for (var i = 0; i < gifObject.topics.length; i++) {
              var newBtn = gifObject.createNewBtn(gifObject.topics[i]);
              $("#buttonSide").append(newBtn);
        }
  },

};   

var timed;
$("#formLabel").html("Enter Animal: ");  
gifObject.initialBtnDisplay();    

$("div").on("click", "video", function(event) {
      gifObject.motionControl(this);  
      event.stopImmediatePropagation();
});

$("#submit").on("click", function(event) {
      event.preventDefault();
      gifObject.clearOut(event);
      var inputTag = $("#gifTag").val();
      $("#gifTag").val("");      
      console.log(inputTag);
      clearTimeout(timed);          
      
      gifObject.pullANDdisplayGIFs(inputTag);
});  

$("#buttonSide").on("click", "button.tags", function() {
      gifObject.clearOut();

      var inputTag = $(this).text();
      console.log(inputTag);
      clearTimeout(timed);

      gifObject.pullANDdisplayGIFs(inputTag);  
}); 

function animatedGIFs(anObject) {
      var i = Math.floor(Math.random() * 10);
      gifObject.displayAnimation(i, anObject); 

      console.log(i);              
      
      timed = setInterval(function() {
          i = Math.floor(Math.random() * 10);
          gifObject.displayAnimation(i, anObject);                           
      }, 10000);
};
