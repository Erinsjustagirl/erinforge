<!-- Modified version of svelte-blockly -->
<!-- https://www.npmjs.com/package/svelte-blockly -->

<script context="module"></script>

<script>
    import { createEventDispatcher } from "svelte";
    import Blockly from "blockly/core.js";
    import registerDynamicCategories from "../../resources/categories";
    export let config = {};
    export let locale;
    export let workspace = undefined;
    export let transform = undefined;
    $: {
        // evaluate transform to establish a reactive dependency
        transform;
        applyTransform();
    }
    const dispatch = createEventDispatcher();
    let width, height;
    function initRoot(root, param) {
        function injectWorkspace(dom, { config, locale: { msg, rtl } }) {
            Blockly.setLocale(msg);
            workspace = Blockly.inject(root, {
                ...config,
                toolbox:
                    config.toolbox ? '<xml><category name="Loading..." colour="100"></category></xml>' : null,
                rtl,
            });
            registerDynamicCategories(workspace);
            if (config.toolbox) workspace.updateToolbox(config.toolbox);
            workspace.refreshToolboxSelection();
            if (dom !== null) {
                try {
                    // don't record this reloading of the workspace for undo
                    Blockly.Events.recordUndo = false;
                    Blockly.Xml.clearWorkspaceAndLoadFromXml(dom, workspace);
                    Blockly.Events.recordUndo = true;
                } catch (ex) {
                    console.warn(ex);
                }
            }
            workspace.addChangeListener(() => {
                dispatch("change");
            });
            // TODO this is a terrible hack, but there's no scroll event
            // translate is the most fundamental in a set of methods
            // that move and zoom the workspace
            // using an arrow function, so `this` is the component not the workspace
            const translate = workspace.translate.bind(workspace);
            workspace.translate = (x, y) => {
                translate(x, y);
                const { scrollX, scrollY, scale } = workspace;
                transform = { scrollX, scrollY, scale };
            };
            if (transform !== undefined) {
                applyTransform();
            } else {
                const { scrollX, scrollY, scale } = workspace;
                transform = { scrollX, scrollY, scale };
            }
        }
        injectWorkspace(null, param);
        return {
            update(param) {
                const dom = Blockly.Xml.workspaceToDom(workspace);
                workspace.dispose();
                injectWorkspace(dom, param);
            },
            destroy() {
                workspace.dispose();
                workspace = undefined;
            },
        };
    }
    function applyTransform() {
        if (workspace === undefined) return;
        const { scrollX, scrollY, scale } = transform;
        if (
            scrollX !== workspace.scrollX ||
            scrollY !== workspace.scrollY ||
            scale !== workspace.scale
        ) {
            workspace.setScale(scale);
            workspace.scroll(scrollX, scrollY);
        }
    }
    $: {
        // evaluate width & height to establish a reactive dependency
        width;
        height;
        if (workspace) {
            Blockly.svgResize(workspace);
        }
    }
    // TODO this breaks smooth scrolling; for now, transform is read-only
    // $: {
    // 	if (workspace && transform) {
    // 		const { scrollX, scrollY, scale } = transform;
    // 		workspace.scroll(scrollX, scrollY);
    // 		workspace.setScale(scale);
    // 	}
    // }
</script>

<div
    class="root"
    bind:offsetWidth={width}
    bind:offsetHeight={height}
    use:initRoot={{ config, locale }}
/>

<style>
    .root {
        width: 100%;
        height: 100%;
    }

    :global(.blocklyToolboxDiv) {
        background: #ffffffcc;
        backdrop-filter: blur(10px);
    }
    :global(.dark .blocklyToolboxDiv) {
        background: #333c;
        backdrop-filter: blur(10px);
    }

    :global(.blocklyToolboxCategory) {
        width: 128px;
        position: relative;
        padding: 0;
    }
    :global(.blocklyTreeSelected) {
        background-color: initial !important;
    }

    :global(.blocklyTreeLabel) {
        font-family: "Noto Sans";
        font-weight: 500;
        font-size: 14px;
        margin-left: 16px;
        transition: 0.3s cubic-bezier(0, 0, 0.3, 1);
        z-index: 2;
        color: #000;
    }
    :global(.dark .blocklyTreeLabel) {
        color: #fff;
    }
    :global(.blocklyTreeSelected .blocklyTreeLabel) {
        margin-left: 4px;
        font-weight: 700;
        color: #000b;
    }

    :global(.categoryBubble) {
        position: absolute;
        top: 6px;
        left: 4px;
        width: 12px;
        height: 12px;
        border-radius: 4px;
        box-sizing: border-box;
        border: 1px solid #0008;
        transition: 0.3s cubic-bezier(0, 0, 0.3, 1);
        z-index: 1;
    }
    :global(.blocklyTreeSelected .categoryBubble) {
        top: 0;
        left: 0;
        width: 128px;
        height: 24px;
        border-radius: 0;
        border-color: #0004;
        border-left: none;
    }

    :global(.blocklyFlyoutButtonBackground) {
        fill: #0000 !important;
        stroke: #575e75;
        stroke-width: 2px;
    }
    :global(.blocklyFlyoutButton:hover .blocklyFlyoutButtonBackground) {
        fill: #0001 !important;
    }
    :global(.blocklyFlyoutButton:active .blocklyFlyoutButtonBackground) {
        fill: #0002 !important;
    }
    :global(.blocklyFlyoutButton .blocklyText) {
        fill: #575e75 !important;
    }

    :global(.dark .blocklyFlyoutButtonBackground) {
        stroke: #b3bcdb;
    }
    :global(.dark .blocklyFlyoutButton:hover .blocklyFlyoutButtonBackground) {
        fill: #fff1 !important;
    }
    :global(.dark .blocklyFlyoutButton:active .blocklyFlyoutButtonBackground) {
        fill: #fff2 !important;
    }
    :global(.dark .blocklyFlyoutButton .blocklyText) {
        fill: #b3bcdb !important;
    }

    :global(.blocklyTreeSeparator) {
        border: none;
        width: calc(100% - 16px);
        height: 6px;
        margin: 8px;
        box-sizing: border-box;
        background: #8888;
        border-radius: 6px;
    }

    :global(.blocklyMainBackground) {
        stroke: none;
    }

    :global(.dark .blocklySvg), :global(.dark .blocklyMutatorBackground) {
        background: #111;
        fill: #111;
        backdrop-filter: blur(5px);
    }

    :global(.blocklyFlyout) {
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
    }

    :global(.dark .blocklyFlyoutBackground) {
        fill: #222b;
    }

    :global(.blocklyFlyoutBackground) {
        fill: #ffffff99;
    }

    :global(.dark .blocklyFlyoutLabelText) {
        fill: #ccc !important;
    }

    :global(.dark .blocklyScrollbarHandle) {
        fill: #777;
        opacity: 0.4;
    }

    :global(.blocklyText) {
        fill: #000b !important;
    }

    :global(.blocklyDropdownText), :global(.blocklyEditableText > image) {
        filter: invert(1);
        opacity: 0.9;
        font-weight: 400 !important;
    }

    :global(.blocklyMenuItemContent) {
        color: #000b !important;
        font-weight: bold;
    }
</style>
