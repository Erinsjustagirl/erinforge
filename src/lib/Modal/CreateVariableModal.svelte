<script>
    import Blockly from "blockly/core"
    import Modal from "./Modal.svelte";

    let varName = "my variable"
    let varType = "null"

    function register(data) {
        window.variables[varName] = {
            type: varType === "null" ? null : varType
        }

        data.toggle()

        varName = "my variable"
        varType = "null"
        window.workspace.refreshToolboxSelection()
    }

    let id = "createVariable"
</script>

<Modal id={id} title="Register Variable" let:data>
    <div class="main">
        <input type="text" placeholder="variable name" bind:value={varName}>
        <select bind:value={varType}>
            <option value="null">Unknown</option>
            <option value="String">String</option>
            <option value="Number">Number</option>
            <option value="Boolean">Boolean</option>
            <option value="List">List</option>
            <option value="Vector">Vector</option>
        </select>
        <button class="btn" on:click={() => {register(data)}}>Register</button>
    </div>
</Modal>

<style>
    .main {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        width: 100%;
        min-height: 100%;
    }

    .btn {
        display: block;
        background: linear-gradient(177.5deg, #ff81ca, #af69ff);
        box-sizing: border-box;
        font-size: 1.5rem;
        border: #0004 solid 0.2rem;
        border-radius: 0.5rem;
        font-family: "Noto Sans";
        font-weight: bold;
        padding: 0.2rem 0.5rem;
        margin: 0.5rem;
    }
</style>