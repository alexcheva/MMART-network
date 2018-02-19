var url = "https://mmart162-api.herokuapp.com/alexpeach/mmart/";
//var url = "https://mmart162-api.herokuapp.com/vanwars/artists/";
var app = angular.module("createApp", []);
app.controller("ctrlr", function($scope, $http) {
     $scope.mmart = [];
     $scope.mmartStudent = null;
     $scope.activeInterest = "";
     $scope.interests = [];

     $scope.setActiveInterest = function(interest) {
          $scope.activeInterest = interest;
     };

     $scope.save = function() {
          if ($scope.mmartStudent._id) {
               $scope.update();
          } else {
               $scope.uploadData();
          }
     };

     $scope.getPhoto = function (student) {
          if (student.imageURL) {
               return student.imageURL;
          } if (student.imageURL === 'undefined')
          { return "http://www.myiconfinder.com/uploads/iconsets/256-256-5d549bce5810acf2482a10b0dc2346fd.png";

          }  else if (student.image) {
               return student.image.items[2].file_path;
          } else {
               return "http://www.myiconfinder.com/uploads/iconsets/256-256-5d549bce5810acf2482a10b0dc2346fd.png";
          }
     };

     $scope.clear = function() {
         console.log('clearing...')
          document.getElementById("form").reset();
          $scope.mmartStudent = null;
     };

     $scope.edit = function(student) {
          if (student.dob) {
               student.dob = new Date(student.dob);
          }
          $scope.mmartStudent = student;
     };

     $scope.uploadData = function() {
          // HTTP POST
          var image = document.getElementById("image").files[0];
          var fd = new FormData();
          fd.append("image", image);
          fd.append("imageURL", $scope.mmartStudent.imageURL);
          fd.append("first", $scope.mmartStudent.first);
          fd.append("last", $scope.mmartStudent.last);
          fd.append("gender", $scope.mmartStudent.gender);
          fd.append("major", $scope.mmartStudent.major);
          fd.append("interests", $scope.mmartStudent.interests);
          fd.append("fb", $scope.mmartStudent.fb);
          fd.append("insta", $scope.mmartStudent.insta);
          fd.append("twit", $scope.mmartStudent.twit);
          fd.append("email", $scope.mmartStudent.email);
          fd.append("dob", $scope.mmartStudent.dob);
          $http.post(url, fd, {
               headers: {
                    'Content-Type': undefined
               },
               transformRequest: angular.identity
          }).success(function(data) {
               console.log(data);
               if (data.dob) {
                    data.dob = new Date(data.dob);
               }
               $scope.mmartStudent = null;
               $scope.getData();
               alert("created");
          }).error(function(data) {
               alert("error");
          });
     };

     $scope.update = function() {
          // HTTP PUT
          var updateURL = url + $scope.mmartStudent._id + "/";
          $http.put(updateURL, $scope.mmartStudent)
               .success(function(data) {
                    alert("saved");
                    $scope.getData();
               })
               .error(function(data) {
                    alert("error");
               });
     };

     $scope.delete = function(id) {
          // HTTP DELETE
          var deleteURL = url + id + "/"
          $http.delete(deleteURL)
               .success(function(data) {
                    $scope.getData();
               })
               .error(function(data) {
                    alert("error");
               });
     };

     $scope.cleanData = function() {
          for (var i = 0; i < $scope.mmart.length; i++) {
               var student = $scope.mmart[i];
               if ( student.dob) {
                    student.dob = new Date(student.dob);
               }
               if (student.email === 'undefined') {
                    student.email = null;
               }
               if (student.major === 'undefined') {
                    student.major = null;
               }
               if (student.gender === 'undefined') {
                    student.gender = null;
               }
               if (student.interests === 'undefined') {
                    student.interests = '';
               }
          }
     };

     $scope.getData = function() {
          $http.get(url)
               .success(function(data) {
                    $scope.mmart = data;
                    $scope.cleanData();
                    console.log($scope.mmart);
                    $scope.makeInterestsList();
                    $scope.redrawGrid();
               })
               .error(function(data) {
                    alert("error");
               });
     };

     $scope.$watchGroup([
            'selectMajor', 'selectedGender', 'activeInterest', 'searchTerm'
        ], function() {
         //redraw masonry grid if variables change:
         $scope.redrawGrid();
     });

     $scope.redrawGrid = function () {
         setTimeout(function () {
             console.log('redrawing grid...');
             var container = document.querySelector('#masonry-grid');
             var msnry = new Masonry( container, {
                   // options
                   //columnWidth: 300,
                   itemSelector: '.grid-item'
             });
         }, 50);
     };

     $scope.makeInterestsList = function() {
          var interests = [];
          //convert interest to an array:
          for (var i = 0; i < $scope.mmart.length; i++) {
               if (typeof $scope.mmart[i].interests === "string") {
                    var _interests = $scope.mmart[i].interests;
                    if (_interests !== 'undefined' && _interests !== '') {
                         $scope.mmart[i].interests = _interests.toLowerCase().split(/,\s+/);
                    } else {
                         $scope.mmart[i].interests = [];
                    }
               }
               interests = interests.concat($scope.mmart[i].interests);
          }
          $scope.interests = Array.from(new Set(interests));
     };

     $scope.getData();

});
