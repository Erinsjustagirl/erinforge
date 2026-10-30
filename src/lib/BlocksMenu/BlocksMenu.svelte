<script>
    import util from "../../resources/util";
    import CreateButton from "./CreateButton.svelte";
    import Blockly from "blockly/core";

    function updateBlocks() {
        blocks = window.blocks
        window.blocks = blocks

        //refresh workspace
        try {
            let workspace = window.workspace
            let xml = Blockly.Xml.workspaceToDom(workspace);
            workspace.clear();
            Blockly.Xml.domToWorkspace(xml, workspace);
            this.refreshToolboxSelection();
        } catch {}
    }

    function createBlock() {
        if (!confirm("Are you sure you want to make a block?")) return

        let id = util.randomHex(16)
        let block = {
            type: "command",
            fields: [
                {
                    type: "label",
                    text: "block",
                    id: util.randomHex(16)
                }
            ]
        }
        window.blocks[id] = block

        let workspace = window.workspace
        /** @type {Blockly.BlockSvg} */
        let defineBlock = workspace.newBlock("blocks_define")
        defineBlock.setDeletable(false)
        defineBlock.blockId_ = id
        defineBlock.updateShape_()
        defineBlock.initSvg()
        defineBlock.render()

        updateBlocks()
    }

    function editBlock(id) {
        window.modals["editblock"].blockId = id
        window.modals["editblock"].tempBlock = window.blocks[id]
        window.modals["editblock"].toggle()
    }

    function deleteBlock(id) {
        const workspace = window.workspace
        const used = workspace.getAllBlocks(false)
            .filter(b => b.blockId_ === id)

        const callCount = used.filter(b => b.type === "blocks_execute").length
        if (!confirm(`Delete this block? This will also delete ${callCount} block(s) that use it.`)) return

        for (const b of used) {
            if (workspace.getBlockById(b.id)) b.dispose(true)
        }

        delete window.blocks[id]
        updateBlocks()
    }

    setInterval(() => {
        if (!globalThis.window) return
        blocks = window.blocks
        window.blocks = blocks
    }, 1000)

    let blocks = {}
</script>

<div class="main">
    <CreateButton on:click={createBlock} />
    {#each Object.entries(blocks) as [id, block]}
        <div class="block">
            <span class="name">{util.blockToName(block.fields)}</span>
            <div>
                <div class="buttons">
                    <button class="edit" on:click={() => editBlock(id)}>Edit</button>
                    <button class="delete" on:click={() => deleteBlock(id)}>Delete</button>
                </div>
            </div>
        </div>
    {:else}
        <p>no blocks yet!</p>
    {/each}    
</div>

<style>
    .main {
        padding: 16px;
        display: flex;
        width: min(calc(100vw - 32px), 1024px);
        flex-direction: column;
        align-items: center;
        margin: auto;
        gap: 0.5em;
    }

    .block {
        background: #8884;
        width: 100%;
        height: 4em;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-radius: 0.8em;
        box-sizing: border-box;
        padding: 8px;
    }

    .buttons .delete {
        background-color: #ff4444;
    }

    .block button {
        appearance: none;
        border: none;
        background: #4bf;
        width: auto;
        font-size: 1rem;
        padding: 0.4rem 1rem;
        border-radius: 0.2em;
        cursor: pointer;
        display: flex;
        justify-content: flex-end;
        font-weight: bold;
    }

    .buttons {
        display: flex;
        gap: 8px;
    }
</style>