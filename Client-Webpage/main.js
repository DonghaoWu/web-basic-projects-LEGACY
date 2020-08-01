//Add a event listener on the button with id 'random_buttom'
//when click on the button, run the function addRandomPicture;
document
  .getElementById("random_button")
  .addEventListener("click", addRandomPicture);
//Set a global varible to control the stage on clicking the button
let hasBeenClicked = false;

function addRandomPicture() {
  //when click, the value of hasBeenClicked is still false.
  if (!hasBeenClicked) {
    //create a new element as a title
    let newDiv = document.createElement("h2");
    newDiv.style.color = "white";
    newDiv.id = "temp";

    let chinese = "pictures/dimsum.jpg";
    let korean = "pictures/korean.jpg";
    let indian = "pictures/indian.jpg";
    let america = "pictures/america.jpg";
    let bbq = "pictures/bbq.jpg";
    let italy = "pictures/italy.jpeg";
    let france = "pictures/france.jpg";
    //set an array to store all the variable pairs.
    let picArr = [
      [chinese, "Chinese Cuisine"],
      [korean, "Korean Cuisine"],
      [indian, "Indian Cuisine"],
      [america, "American Cuisine"],
      [italy, "Italian Cuisine"],
      [france, "French Cuisine"],
      [bbq, "BBQ"]
    ];
    //invoke the function randomPic and get a random variable pair
    let randomContent = randomPic(picArr);
    newDiv.innerText = randomContent[1];
    //change the source of the picture
    document.getElementById("question_pic_holder").src = randomContent[0];
    //add the new title div
    document.getElementById("card").appendChild(newDiv);
    //at the end ,set the value of hasBeenClicked to be true
    hasBeenClicked = true;
  } else if (hasBeenClicked) {
    //when the button has been clicked, and the client click it again
    //remove the title element
    document.getElementById("temp").remove();
    //set the value of hasBeenClicked to be false,so that the function
    //addRandomPicture will run the first if statement part.
    hasBeenClicked = false;
    addRandomPicture();
  }
}
//random function,get a random element from an array
function randomPic(arr) {
  let random = Math.floor(Math.random() * arr.length);
  return arr[random];
}
