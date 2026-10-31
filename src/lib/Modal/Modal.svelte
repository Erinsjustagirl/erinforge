<script>
    import { onMount } from "svelte";

    import ExitIcon from "$lib/images/nav/exit.svg"

    export let id = "unknown";
    export let title = "Unknown";

    let data = {
        visible: false,
        update: function () {data = data},
        toggle: function () {data.visible = !data.visible; data.update()}
    }
    
    onMount(() => {
        if (!window.modals) window.modals = {}
        window.modals[id] = data
    })
</script>

<div class="modal" class:visible={data.visible}>
    <div class="inside">
        <div class="bar">
            <span class="title">{title}</span>
            <button class="exit" on:click={data.toggle}>
                <img src={ExitIcon} alt="" />
            </button>
        </div>
        <div class="body">
            <slot {data} />
        </div>
    </div>
</div>

<style>
    .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 999;
        backdrop-filter: brightness(0.7) blur(.25vh);
    }
    .modal:not(.visible) {
        display: none;
        z-index: -999;
    }

    .inside {
        position: absolute;
        top: 15%;
        left: 15%;
        width: 70%;
        height: 70%;
        border-radius: 1.5rem;
        background-color: #eee;
        overflow: hidden;
    }

    .bar {
        height: 3rem;
        display: flex;
        justify-content: center;
        align-items: center;
        background: linear-gradient(177.5deg, #ff81ca, #af69ff);
    }
    
    .title {
        font-size: 1.25rem;
        font-weight: bold;
        flex: calc(100% - 2em);
        text-align: center;
        opacity: 0.8;
    }

    .exit {
        flex: 2em;
        margin-right: 1em;
        width: 2rem;
        aspect-ratio: 1;
        border: none;
        padding: 0;
        background-color: #0000;
        cursor: pointer;
        opacity: 0.8;
    }
    .exit img {
        aspect-ratio: 1;
        padding-top: 0.25em;
    }

    .body {
        width: 100%;
        height: calc(100% - 3em);
        padding: 1rem;
        box-sizing: border-box;
        overflow: auto;
    }

    :global(.dark) .body {
        background: #222;
        color: #fff;
    }
</style>