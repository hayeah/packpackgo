<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<style>
  html, body, #app, .page {
    height: 100%;
  }

  * {
    box-sizing: border-box;
  }
    
  body {
    background-color: #f0f0f0;
    font: 16px/1.5 -apple-system, BlinkMacSystemFont,
                   'avenir next', avenir,
                   helvetica, 'helvetica neue',
                   Ubuntu,
                   'segoe ui', arial,
                   sans-serif;
  }
    
  body, h1, h2, h3, h4, h5, ul {
    margin: 0;
  }
  
  .hr {
    position: relative;
    height: 30px;
  }
  .hr:before {
    content: attr(aria-label);
    display: inline-block;
    position: absolute;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    z-index: 2;
    background-color: white;
    color: #999;
    width: 34px;
  }
  .hr:after {
    content: '';
    height: 1px;
    display: block;
    background-color: #f0f0f0;
    position: absolute;
    left: 0;
    top: 50%;
    right: 0;
    z-index: 1;
  }
  .nowrap {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>