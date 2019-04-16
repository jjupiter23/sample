# A sample exercise using the Google Maps API
https://jjupiter23.github.io/sample/

What the code is able to accomplish is explained below:

* Plots restaurants across Cebu City - for demonstration purposes search radius is limited to 500
* Restaurant can be filtered according to cuisine offered, currently the only options available are Filipino, Chinese, American and Mexican.
* Directions to the establishment can be triggered by clicking the designated marker
* Usage of drawing tools to count the number of restaurants within the bounds of a user drawn circle or rectangle. In order for this to function, the user must first filter restaurants to enable the map markers. Then by drawing a shape it will count how many restaurants are in the vicinity.
* Simple analytics like the number of user ratings
* Use of browser's localStorage to "track" the number of customers per restaurant, this is done by getting directions to the restaurant and by clicking the 'Visit' button on the left panel, by default this will increment by 1. 
