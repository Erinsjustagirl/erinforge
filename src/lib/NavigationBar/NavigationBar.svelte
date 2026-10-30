<script>
    import Icon from "$lib/images/icon.svg"
</script>

<div class="nav">
    <img
        src={Icon}
        alt="Logo"
        class="logo-margin"
        style="height: 40px;"
    />
    <slot />
</div>

<style>
    .nav {
        position: fixed;
        left: 0px;
        top: 0px;
        width: 100%;
        height: 3rem;

        display: flex;
        flex-direction: row;
        align-items: center;
        z-index: 100;

        background: linear-gradient(177.5deg, #ff81ca, #af69ff);
    }

    .logo-margin {
        margin: 0 6px;
        margin-left: 10px;
    }
</style>