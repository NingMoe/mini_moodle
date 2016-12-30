<template>
    <div id="app">
        <router-view></router-view>
        <div id="footer">
            Designed by JacelynFish (Hongyuan Jin). Powered by Vue2.0, Sass, Webpack, Node.js and Express.js.
        </div>
    </div>

</template>

<script></script>
<style lang="sass">
    @import '../style/_global.scss';

    #app{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100vh;
        font-family: $defaultFont;
    }

    #footer{
        height: 8vh;
        line-height: 8vh;
        width: 100vw;
        font-size: 12px;
        color:$gColor;
        text-align: center;
        background-color: #eee;

    }
</style>