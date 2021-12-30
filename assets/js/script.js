$(document).ready(function () {
  var cityName = "";
  var lat = "";
  var lon = "";

  //function that gets the current weather and daily weather
  function getWeatherOneAPI(a,b) {
      var getApi = "https://api.openweathermap.org/data/2.5/onecall?lat=" + a + "&lon=" + b + "&exclude=minutely,hourly&appid=aec299195260a001b09706b5bfe740f7&units=imperial";

      //second API call to get the rest of the current weather data along with 5 day forecast
      $.ajax({
          url: getApi,
          method: "GET"
      }).then(function (response) {
          console.log(response);

          $(".card-deck").empty();

          //if statement to update the background color of the UV Index
          var uvi = parseInt(response.current.uvi);
          if (uvi <= 2) {
              $(".color").css({ "background-color": "green", "color": "white" });
          } else if (uvi >= 3 && uvi <= 5) {
              $(".color").css({ "background-color": "yellow", "color": "black" });
          } else if (uvi >= 6 && uvi <= 7) {
              $(".color").css({ "background-color": "orange" });
          } else if (uvi >= 8 && uvi <= 10) {
              $(".color").css({ "background-color": "red", "color": "white" });
          } else if (uvi >= 11) {
              $(".color").css({ "background-color": "violet", "color": "white" });
          }

          $("#temp").text("Temperature: " + response.current.temp + "° F");
          $("#humidity").text("Humidity: " + response.current.humidity + "%");
          $("#wind").text("Wind Speed: " + response.current.wind_speed + " MPH");
          $(".color").text(response.current.uvi);

          //displays the html to the user
          $("#current").css({"display":"block"});

          var daily = response.daily;

          //for loop to loop through the daily response array
          for (i = 1; i < daily.length - 2; i++) {
              var dailyDate = moment.unix(daily[i].dt).format("MM/DD/YYYY");
              var dailyTemp = daily[i].temp.day;
              var dailyWind = daily[i].wind_speed;
              var dailyHumid = daily[i].humidity;
              var dailyIcon = daily[i].weather[0].icon;

              var dailyDiv = $("<div class='card text-white bg-secondary p-2'>")
              var temp = $("<p>");
              var humid = $("<p>");
              var wind = $("<p>");
              var imgIcon = $("<img>");
              var date = $("<h6>");

              date.text(dailyDate);
              imgIcon.attr("src", "https://openweathermap.org/img/wn/" + dailyIcon + "@2x.png")
              imgIcon.addClass("img-fluid");
              imgIcon.css({"width": "40%"});
              temp.text("Temp: " + dailyTemp + "° F");
              wind.text("Wind: " + dailyWind + " MPH")
              humid.text("Humidity: " + dailyHumid + "%");

              dailyDiv.append(date);
              dailyDiv.append(imgIcon);
              dailyDiv.append(temp);
              dailyDiv.append(wind);
              dailyDiv.append(humid);
              $(".card-deck").append(dailyDiv);

              //displays this html to the user
              $("#five-day").css({"display":"block"});
          }

      })
  }

  //function that uses the city user input to make an API call
  function getWeather() {
      var callApi = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&lang=en&appid=aec299195260a001b09706b5bfe740f7";

      //first API call to get the lat and lon
      $.ajax({
          url: callApi,
          method: "GET"
      }).then(function (response) {
          lat = response.coord.lat;
          lon = response.coord.lon;

          //adds the city name and date to the html for the current weather
          $("#city").text(response.name);
          $("#date").text(moment.unix(response.dt).format("dddd, MM/DD/YYYY"));
          
          localStorage.setItem("cityname", response.name);
          
          getWeatherOneAPI(lat,lon);

      })
  }

  //function to display the last searched city's data
  function init(){
      cityName = localStorage.getItem("cityname");
      if (cityName !== null) {

          var cityList = $("<button>");
          cityList.addClass("list-group-item list-group-item-action text-light bg-secondary");
          cityList.text(cityName);
          $("ul").prepend(cityList);
          getWeather()
      }
  }

  function searchButton() {
      cityName = $("input").val().trim();

      //buttons are created dynamically as the user enters more cities to search
      var cityList = $("<button>");
      cityList.addClass("list-group-item list-group-item-action");
      cityList.text(cityName);

      $("ul").prepend(cityList);
      //after the user's city is saved to the list, the input field is cleared out
      $("input").val("");

      getWeather();
  }

  init();

  //submit event for when the users enter the city search term
  $("#city-form").submit(function (event) {
      event.preventDefault();
      searchButton();
  })

  $("#form-submit").click(function (event) {
      event.preventDefault();
      searchButton();
  })

  //click event listener for when the user clicks on a city in the history list
  $("ul").on("click", "button", function () {
      cityName = $(this).text();
      console.log(cityName);

      getWeather();
  })

  //error handling for when an incorrect city is typed
  $( document ).ajaxError(function() {
      var error = $("<p>");
      error.addClass("error");
      error.css({"color": "red"});
      error.text("Please try again with a valid city");
     
      $("ul").prepend(error);
     
      var p = $(this).find("button");
     
      p[1].remove();
  
      setTimeout(function () {
          error.remove();
          }, 5000);
    });

})