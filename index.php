<!doctype html>
<html lang="en" ng-controller="CommonController">
<head>
    <meta charset="utf-8">
    <title>woundary.com prototype</title>
    <link href="css/bootstrap.css" type="text/css" rel="stylesheet"/>
    <link href="css/app.css" type="text/css" rel="stylesheet"/>

    <!-- HTML5 shim, for IE6-8 support of HTML5 elements -->
    <!--[if lt IE 9]>
    <script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->

    <!--
        꼭 필요한 필수 CSS는 위와 같이 고정해서 붙이고,
        일부 페이지마다 필요한 CSS은 아래와 같이 컨트롤러에서 설정해서 로드한다. (IE8 에서도 정상동작)
        http://plnkr.co/edit/KzjIMN
    -->
    <link ng-repeat="stylesheet in stylesheets" ng-href="{{stylesheet}}" type="text/css" rel="stylesheet" />
</head>
<body>

<div>
    <a href="#/view1" class="btn">view1</a>
    <a href="#/view2" class="btn">view2</a>
    <a href="#/grid" class="btn">grid</a>
    <a href="#/admin" class="btn" ng-show="isAdmin">admin</a>
</div>

<hr>

<div ng-view class="well well-small"></div>

<button ng-hide="isAdmin" ng-click="isAdmin=true;">Become admin</button>


<!--
	이 data-main 속성에서 requireJS가 처음 로드해야할 JS를 설정한다.
	아래와 같이 쓰면, js 폴더 아래에 main.js 파일을 열게 된다.
 -->
<script data-main="js/main" src="lib/require/require.js"></script>
</body>
</html>
