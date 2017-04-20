(function(window, undefined) {'use strict';


angular.module('adf.widget.tox', ['adf.provider'])

  .config(["dashboardProvider", function(dashboardProvider){
    dashboardProvider
      .widget('tox', {
        title: 'Tox',
        description: 'tox',
        controller: 'toxCtrl',
        templateUrl: '{widgetsPath}/tox/src/view.html',
        edit: {
          templateUrl: '{widgetsPath}/tox/src/edit.html'
        }
      });
  }])

  .controller('toxCtrl', ["$http", "$q", "$scope", "$interval", "config", "commonService", function ($http, $q, $scope, $interval, config, commonService) {

    $scope.config = config;
    $scope.selectedWorkspace = commonService.selectedWorkspace;

    var iteration = function(){
      var workspace = commonService.selectedWorkspace;

      if (workspace){
        $http.get($scope.selectedWorkspace.metadata.springbank.extUrl + '/' + $scope.selectedWorkspace.instanceId + '/toolsResults/tox').then(function(response){
          var details = response.data.data;

          $scope.details = details;
          if ($scope.details.value){
            $scope.details = details.value;
          }

        }, function(err){
          $scope.details = null;
        });

        $http.get($scope.selectedWorkspace.metadata.springbank.extUrl + '/' + $scope.selectedWorkspace.instanceId + '/toolsStatusCodes/tox').then(function(exitCodeResponse){
          $scope.code = exitCodeResponse.data.data;
        }, function(err){
          $scope.code = null;
        });

        var keys = Object.keys(workspace.metadata.microtools);
        for (var i=0; i<keys.length; i++) {
          var entry = workspace.metadata.microtools[keys[i]];
          if (entry.name.indexOf("tox") !== -1){ // if log in microtool name
            $scope.microtool = entry;
            break;
          }
        }
      }

    };
    $scope.startTox = function(){
      $http.get($scope.microtool.extUrls[0] + '/tox').then(function(exitCodeResponse){
      }, function(err){
      });
    };

    iteration();
    // Fetch info every 1 seconds.
    $interval(function(){iteration()}, 1000)

  }]);

angular.module("adf.widget.tox").run(["$templateCache", function($templateCache) {$templateCache.put("{widgetsPath}/tox/src/edit.html","<form role=form><div class=form-group><label for=sample>Sample</label> <input type=text class=form-control id=sample ng-model=config.sample placeholder=\"Enter sample\"></div></form>");
$templateCache.put("{widgetsPath}/tox/src/view.html","<div><div ng-show=microtool><p ng-hide=microtool.extUrls[0]>Cannot get the link to Tox.</p><a target=_blank class=btn ng-if=microtool.extUrls[0] ng-click=startTox>Start Tox</a><br></div><div ng-hide=microtool><p>No Tox Microtool</p></div></div><style>\n  p.padding-5-margin-0{\n    padding-top: 5px;\n    margin: 0;\n  }\n  .glyphicon{\n    padding-right: 10px;\n  }\n  .failure-code {\n    margin: 0 !important;\n    padding: 5px 25px !important;\n  }\n  .microtool .glyphicon-ok-circle{\n    color: #00cc55;\n  }\n  .microtool .glyphicon-remove-circle{\n    color: #ee9999;\n  }\n  .microtool .glyphicon-warning-sign{\n    color: #eeee55;\n  }\n</style><div ng-if=details class=microtool><div ng-if=details.message><span class=\"glyphicon glyphicon-ok-circle\"></span><p>{{ details.message }} at {{details.timeStamp}}</p></div><div ng-if=details.error><span class=\"glyphicon glyphicon-remove-circle\"></span><p>{{ details.error }} at {{details.timeStamp}}</p></div></div><div ng-if=!details><p><b>Tox</b> microtool is not running.</p></div>");}]);})(window);
