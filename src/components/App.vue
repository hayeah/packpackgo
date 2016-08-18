<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<style>
  html, body, #app, .page {
    height: 100%;
  }
    
  body {
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
    
  .empty-state {
    font-size: 3rem;
    color: #666;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    text-shadow: 0 0 1px #ccc;
    background-color: #f0f0f0;
  }
</style>